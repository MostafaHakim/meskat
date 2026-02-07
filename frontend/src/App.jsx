import { Routes, Route } from "react-router-dom";

import Mosquitonet from "./pages/Mosquitonet";

function App() {
  return (
    <Routes>
      <Route path="/mosquitonet" element={<Mosquitonet />} />
    </Routes>
  );
}

export default App;
