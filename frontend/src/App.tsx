import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/index.css";
import Header from "./components/Header";
import PatientProfile from "./pages/PatientProfile";
import PatientList from "./pages/PatientList";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter basename="/ai-kidney-diagnosis-webapp-fron2">
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <PatientList/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patients/:id"
                    element={
                        <ProtectedRoute>
                            <PatientProfile />
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
