import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/index.css";
import Header from "./components/Header";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function App() {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
