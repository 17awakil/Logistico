import React from 'react'
import axios from "axios";
import InventoryItemCard from '../components/InventoryItemCard';
import { Form, Button } from "react-bootstrap";
import "../App.css";
import { Link, Outlet } from "react-router-dom";


export default function Items() {
  const [inventoryItems, setInventoryItems] = React.useState(null);

  React.useEffect(() => {
    axios.get("/api/inventoryItems")
      .then((res) => { setInventoryItems(res.data); });
  }, []);

  return (
    <div className="grid" >{!inventoryItems ? <h1 style={{ alignSelf: "center" }}>Loading...</h1> :
      inventoryItems.length == 0 ? <h1 style={{ alignSelf: "center" }}> No inventory items exist...</h1> :
        (inventoryItems.map(item =>
          <InventoryItemCard
            key={item._id}
            _id={item._id}
            name={item.name}
            description={item.description}
            inventoryCount={item.inventoryCount}
            image={item.thumbnail_image}
          >
          </InventoryItemCard>
        ))
    }
    </div>
  );
}
