"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var InventoryItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    inventoryCount: {
        type: Number,
        required: true,
    },
    tags: [String],
    image: { type: Schema.Types.ObjectId, ref: "images.files" },
    thumbnail_image: { type: Schema.Types.ObjectId, ref: "images.files" }
});


module.exports = mongoose.model("InventoryItem", InventoryItemSchema);
