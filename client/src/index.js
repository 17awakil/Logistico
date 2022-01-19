import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Items from "./routes/items";
import InventoryItemCard from './components/InventoryItemCard';
import { Container, Navbar, Nav } from "react-bootstrap";
import Item from './routes/item';
import EditItem from './routes/editItem';
import CreateItem from './routes/createItem';

ReactDOM.render(

  <BrowserRouter>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Logistico</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/items">Inventory Items</Nav.Link>
            <Nav.Link as={Link} to="/items/create">Create Inventory Item</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/items/" element={<Items />}>
      </Route>
      <Route path="/items/:itemId" element={<Item />} />
      <Route path="/items/:itemId/edit" element={<EditItem />} />
      <Route path="/items/create" element={<CreateItem />} />
      <Route
        path="*"
        element={
          <main className="App" style={{ padding: "1rem" }}>
            <h1>Oops... There's nothing here</h1>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
