import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";

import { Catalogue } from "./views/Catalogue";
import { ItemDetail } from "./views/ItemDetail";
import { Login } from "./views/Login";
import { NotFound } from "./views/NotFound";
import { Register } from "./views/Register";

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogue />} />
        <Route path="/items/:itemId" element={<ItemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}