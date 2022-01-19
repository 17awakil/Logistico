import React from 'react';
import { Card, Button } from 'react-bootstrap'
import { Link, Outlet } from "react-router-dom";

export default function InventoryItemCard(props) {
    return (
        <Card style={{ width: '18rem', margin: '1px' }} key={props._id} className="box">
            <Card.Img variant="top" src={`/api/inventoryItems/${props._id}/image/${props.image}`} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Button as={Link} to={`/items/${props._id}`} variant="primary">View Inventory Item Details</Button>
            </Card.Body>
        </Card>
    );
}
