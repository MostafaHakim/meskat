import { Routes, Route } from "react-router-dom";

import Mosquitonet from "./pages/Mosquitonet";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Routes>
      <Route path="/mosquitonet" element={<Mosquitonet />} />
      <Route path="/add" element={<AddProduct />} />
    </Routes>
  );
}

export default App;
