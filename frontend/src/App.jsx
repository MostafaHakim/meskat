import { Routes, Route } from "react-router-dom";

import Mosquitonet from "./pages/Mosquitonet";
import AddProduct from "./pages/AddProduct";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/mosquitonet" element={<Mosquitonet />} />
      <Route path="/add" element={<AddProduct />} />
    </Routes>
  );
}

export default App;
