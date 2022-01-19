import React from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
export default function Item() {
    let params = useParams();
    const [inventoryItem, setInventoryItem] = React.useState(null);

    React.useEffect(() => {
        console.log(params.itemId);
        axios.get(`/api/inventoryItems/${params.itemId}`)
            .then((res) => { setInventoryItem(res.data); console.log(inventoryItem) });
    }, []);

    return (!inventoryItem ? <h1>Loading...</h1> :
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "1rem", justifyContent: "center" }}>
            <div>
                <h1>{inventoryItem.name}</h1>
                <p><strong>Description</strong>: {inventoryItem.description}</p>
                <p><strong>Inventory count</strong>: {inventoryItem.inventoryCount}</p>
                <p><strong>Tags</strong>: {inventoryItem.tags.map((tag) => `${tag}, `)}</p>
                <Button as={Link} to={`/items/${params.itemId}/edit`} variant="primary">Edit Inventory Item</Button>
            </div>
            <img
                src={`/api/inventoryItems/${inventoryItem._id}/image/${inventoryItem.image}`}
                alt={inventoryItem.name}
                style={{ width: "100%", maxWidth: "700px" }}
            >
            </img>

        </div>
    );
}
