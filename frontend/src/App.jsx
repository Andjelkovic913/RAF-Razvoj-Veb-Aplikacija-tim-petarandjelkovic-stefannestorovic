import './style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import NavigationBar from "./components/NavigationBar";
import { isAuthenticated, isAdmin } from "./auth.js";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryFormPage = lazy(() => import("./pages/CategoryFormPage"));
const AllCategoriesPage = lazy(() => import("./pages/AllCategoriesPage"));

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
    if (!isAuthenticated()) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/" />;
    return element;
};

function App() {
    return (
        <div className="App">
            <Router>
                <NavigationBar />
                <main className="main-content">
                    <Suspense fallback={
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/kategorije" element={<AllCategoriesPage />} />

                            <Route path="/cms/users" element={<AdminRoute element={<UsersPage />} />} />
                            <Route path="/cms/categories" element={<PrivateRoute element={<CategoriesPage />} />} />
                            <Route path="/cms/categories/new" element={<PrivateRoute element={<CategoryFormPage />} />} />
                            <Route path="/cms/categories/:id/edit" element={<PrivateRoute element={<CategoryFormPage />} />} />
                        </Routes>
                    </Suspense>
                </main>
            </Router>
        </div>
    );
}

export default App;
