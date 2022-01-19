import React from 'react'
import axios from "axios";
import { Form, Button, Alert } from 'react-bootstrap';
import { Navigate, useParams } from "react-router-dom";

export default function EditItem() {
    let params = useParams();
    const [inventoryItem, setInventoryItem] = React.useState(null);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [inventoryCount, setInventoryCount] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [image, setImage] = React.useState(null);
    // alerts
    const [success, setSuccess] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    //navigate
    const [toItemsPage, setToItemsPage] = React.useState(false)

    React.useEffect(() => {
        axios.get(`/api/inventoryItems/${params.itemId}`)
            .then((res) => { setInventoryItem(res.data); });
    }, []);

    if (toItemsPage === true) {
        return <Navigate to='/items' />
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append("name", name);
        bodyFormData.append("description", description);
        bodyFormData.append("inventoryCount", inventoryCount);
        bodyFormData.append("tags", tags);
        bodyFormData.append("file", image);
        console.log("put endpoint " + `/api/inventoryItems/${params.itemId}`);
        try {
            await axios({
                method: "put",
                url: `/api/inventoryItems/${params.itemId}`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((res) => { console.log("successful update"); setToItemsPage(true); })
                .catch(err => {
                    console.log("catch in update" + JSON.stringify(err.response.data.message));
                    setErrorMessage(err.response.data.message);
                })

        }
        catch (error) {
            console.log("catch : " + error.message)
        }
    }


    const handleDelete = async (event) => {
        try {
            await axios.delete(`/api/inventoryItems/${params.itemId}`)
                .then((res) => setToItemsPage(true))
                .catch(err => {
                    console.log("catch in delete" + JSON.stringify(err.response.data.message));
                    setErrorMessage(err.response.data.message);
                });

        }
        catch (error) {
            console.log("catch : " + error.message)
        }
    };

    let alert;
    if (success) {
        alert = <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            <Alert.Heading>Successfully updated inventory item!</Alert.Heading>
        </Alert>
    }

    if (errorMessage) {
        alert = <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            <Alert.Heading>Error updating item...</Alert.Heading>
            <p> {errorMessage}</p>
        </Alert>
    }
    return (!inventoryItem ? <h1>Loading...</h1> :
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2rem", justifyContent: "space-between" }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" defaultValue={inventoryItem.name} onChange={e => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" defaultValue={inventoryItem.description} onChange={e => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Inventory Count</Form.Label>
                    <Form.Control type="text" defaultValue={inventoryItem.inventoryCount} onChange={e => setInventoryCount(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" defaultValue={inventoryItem.tags} onChange={e => setTags(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={e => setImage(e.target.files[0])} />
                </Form.Group>
                <div style={{ display: "flex", direction: "row", justifyContent: "space-between" }}>
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                    <Button variant="danger" type="button" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Form>
            {alert}
        </div>
    )
}
