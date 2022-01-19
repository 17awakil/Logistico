import React from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Navigate } from "react-router-dom";

export default function CreateItem() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [inventoryCount, setInventoryCount] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [image, setImage] = React.useState(null);
    // alerts
    const [errorMessage, setErrorMessage] = React.useState(null);
    //navigate
    const [toItemsPage, setToItemsPage] = React.useState(false)

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
        try {
            await axios({
                method: "post",
                url: "/api/inventoryItems/",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((res) => setToItemsPage(true))
                .catch(err => {
                    console.log(JSON.stringify(err.response.data.message));
                    setErrorMessage(err.response.data.message);
                })

        }
        catch (error) {
            console.log("catch : " + error.message)
        }
    }


    alert = !errorMessage ? null : <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
        <Alert.Heading>Error creating item...</Alert.Heading>
        <p> {errorMessage}</p>
    </Alert>


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2rem", justifyContent: "space-between" }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter item name" onChange={e => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter item description" onChange={e => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Inventory Count</Form.Label>
                    <Form.Control type="text" placeholder="Enter number" onChange={e => setInventoryCount(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" placeholder="Enter tags" onChange={e => setTags(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={e => setImage(e.target.files[0])} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
            {alert}
        </div>
    )
}
