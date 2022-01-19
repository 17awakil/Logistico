var mongoose = require("mongoose"),
    InventoryItem = mongoose.model("InventoryItem");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const sharp = require("sharp");


var conn = mongoose.createConnection(process.env.MONGO_URI);
var bucket;
conn.once('open', function () {
    bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "images" });
});

router.post("/", upload,
    function (req, res, next) {
        if (req.file) {
            var downloadStream = bucket.openDownloadStreamByName(req.file.filename);
            var uploadStream = bucket.openUploadStream("thumbnail_" + req.file.filename);
            req.thumbnailId = uploadStream.id;
            var resizeTransform = sharp().resize(268, 180);
            downloadStream.pipe(resizeTransform).pipe(uploadStream);
            next();
        }
        else {
            if (req.file === undefined) {
                return res.status(400).send({ message: "You must select an image of type jpeg or png." });
            }
            if (req.file.mimetype != 'image/jpeg' && req.file.mimetype != 'image/png') {
                return res.status(400).send({ message: "File must be of type jpeg or png." });
            }
        }
    },
    async function (req, res) {
        try {
            // Input Validation
            const { name, description, inventoryCount, tags } = req.body
            if (!name || !description || !inventoryCount || !tags) {
                bucket.delete(inventoryItem.image, () => { console.log("deleted original image") });
                bucket.delete(inventoryItem.thumbnail_image, () => { console.log("deleted thumbnail image") })
                return res.status(400).send({ message: "Please fill in all fields." });
            }
            if (isNaN(inventoryCount)) {
                bucket.delete(inventoryItem.image, () => { console.log("deleted original image") });
                bucket.delete(inventoryItem.thumbnail_image, () => { console.log("deleted thumbnail image") })
                return res.status(400).send({ message: "Inventory count must be a number." });
            }

            var inventoryItem = new InventoryItem(
                {
                    name: name,
                    description: description,
                    inventoryCount: inventoryCount,
                    tags: tags,
                    image: req.file.id,
                    thumbnail_image: req.thumbnailId
                });

            await inventoryItem.save((error, item) => {
                if (error) {
                    // delete uploaded files if inventory item is not created
                    bucket.delete(inventoryItem.image, () => { console.log("deleted original image") });
                    bucket.delete(inventoryItem.thumbnail_image, () => { console.log("deleted thumbnail image") });
                    res.status(400).send("Could not create inventory item.\n" + error);
                }
                else {
                    res.status(201).send("Successfully created inventory item!");
                }
            });


        }
        catch (error) {
            res.status(400).send("Could not create inventory item.\n" + error.message);
        }

    });

router.get("/:itemID", async function (req, res) {
    try {
        const id = req.params["itemID"];
        if (!id) {
            return res.status(400).send("Must input the item id.");
        }
        InventoryItem.findById(id, null, null, (error, result) => {
            if (error) return res.status(400).send("Could not retrieve inventory item.\n" + error);
            else if (!result) return res.status(400).send("Inventory item does not exist.");
            else {
                return res.status(200).send(result);
            }
        });
    }
    catch (error) {
        res.status(400).send("Could not retrieve inventory item.\n" + error);
    }
});

router.put("/:itemID", upload,
    function (req, res, next) {
        if (req.file) {
            var downloadStream = bucket.openDownloadStreamByName(req.file.filename);
            var uploadStream = bucket.openUploadStream("thumbnail_" + req.file.filename);
            req.thumbnailId = uploadStream.id;
            var resizeTransform = sharp().resize(268, 180);
            downloadStream.pipe(resizeTransform).pipe(uploadStream);
        }
        next();
    },
    async function (req, res) {
        try {
            const id = req.params["itemID"];
            var body = {};
            const { name, description, inventoryCount, tags } = req.body

            // Input Validation
            if (!id) {
                return res.status(400).send({ message: "Please input a valid id" });
            }

            if (!name && !description && !inventoryCount && !tags && !req.file) {
                return res.status(400).send({ message: "Please update at least one field or the item's image." });
            }
            if (inventoryCount && isNaN(inventoryCount)) {
                bucket.delete(req.file.id, () => { console.log("deleted newly uploaded image") })
                bucket.delete(req.thumbnailId, () => { console.log("deleted newly uploaded thumbnail image") })
                return res.status(400).send({ message: "Inventory count must be a number." });
            }

            // Only add updated fields to update body 
            if (name) {
                body["name"] = name;
            }
            if (description) {
                body["description"] = description;
            }
            if (inventoryCount) {
                body["inventoryCount"] = inventoryCount;
            }
            if (tags) {
                body["tags"] = tags;
            }
            if (req.file) {
                body["image"] = req.file.id;
                body["thumbnail_image"] = req.thumbnailId;
            }

            InventoryItem.findByIdAndUpdate(id, body, null, (error, result) => {
                if (error) res.status(400).send("Could not update inventory item.");
                else if (!result) res.status(400).send("Cannot update inventory item that does not exist.");
                else {
                    if (body.image && body.thumbnail_image) {
                        bucket.delete(result.image, () => { console.log("Successfully deleted original image"); })
                        bucket.delete(result.thumbnail_image, () => { console.log("Successfully deleted thumbnail image"); })
                    }
                    res.status(200).send("Successfully updated inventory item.");
                }
            });
        }
        catch (error) {
            return res.status(500).send({
                message: error.message,
            });
        }
    });

router.delete("/:itemID", async function (req, res) {
    try {
        const id = req.params["itemID"];
        if (!id) {
            return res.status(400).send("Must input the item id.");
        }
        InventoryItem.findByIdAndDelete(id, null, (error, result) => {
            if (error) res.status(400).send("Could not delete inventory item.");
            else if (!result) res.status(400).send("Cannot delete inventory item that does not exist.");
            else {
                bucket.delete(result.image, () => { console.log("Successfully deleted original image"); })
                bucket.delete(result.thumbnail_image, () => { console.log("Successfully deleted thumbnail image"); })
                res.status(200).send("Successfully deleted inventory item.");
            }
        });
    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
});

router.get("/", function (req, res) {
    try {
        InventoryItem.find({}, (error, items) => {
            if (error) return res.status(400).send("Could not find inventory items");
            else return res.status(200).send(items);
        })
    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
});

router.get("/:itemID/image/:imageID", async function (req, res) {
    try {
        const id = req.params["itemID"];
        const imageID = req.params["imageID"];

        if (!id || !imageID) {
            return res.status(400).send("Must input an itemID and imageID");
        }

        InventoryItem.findById(id, null, null, (error, result) => {
            if (error) res.status(400).send("Could not retrieve inventory item.\n" + error);
            else if (!result) res.status(400).send("Inventory item does not exist.");
            else {
                var imgID = undefined;
                if (imageID == result.image) {
                    imgID = result.image;
                }
                else if (imageID == result.thumbnail_image) {
                    imgID = result.thumbnail_image;
                }

                if (imgID == undefined) {
                    return res.status(400).send("No such file with id " + imageID + " exist.");
                };

                let downloadStream = bucket.openDownloadStream(imgID);

                downloadStream.on("data", function (data) {
                    return res.status(200).write(data);
                });

                downloadStream.on("error", function (err) {
                    return res.status(404).send({ message: "Cannot download the image!" + err });
                });

                downloadStream.on("end", () => {
                    return res.end();
                });
            }
        });
    }
    catch (error) {

        res.status(500).send("Could not retrieve image.\n" + error.message);
    }
});

module.exports = router;