import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Catalogue } from "./views/Catalogue";
import { Collection } from "./views/Collection";
import { ItemDetail } from "./views/ItemDetail";
import { Login } from "./views/Login";
import { NotFound } from "./views/NotFound";
import { Register } from "./views/Register";
import { Stats } from "./views/Stats";

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/items/:itemId" element={<ItemDetail />} />
          <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}