import './style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import NavigationBar from "./components/NavigationBar";
import { isAuthenticated, isAdmin } from "./auth.js";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AllCategoriesPage = lazy(() => import("./pages/AllCategoriesPage"));
const CategoryNewsPage = lazy(() => import("./pages/CategoryNewsPage"));
const NajcitanijePage = lazy(() => import("./pages/NajcitanijePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage"));
const TagPage = lazy(() => import("./pages/TagPage"));

const CmsUsersPage = lazy(() => import("./pages/CmsUsersPage"));
const CmsUserFormPage = lazy(() => import("./pages/CmsUserFormPage"));
const CmsCategoriesPage = lazy(() => import("./pages/CmsCategoriesPage"));
const CmsCategoryFormPage = lazy(() => import("./pages/CmsCategoryFormPage"));
const CmsNewsListPage = lazy(() => import("./pages/CmsNewsListPage"));
const CmsNewsFormPage = lazy(() => import("./pages/CmsNewsFormPage"));

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

                            <Route path="/najcitanije" element={<NajcitanijePage />} />
                            <Route path="/pretraga" element={<SearchPage />} />

                            <Route path="/kategorije" element={<AllCategoriesPage />} />
                            <Route path="/kategorije/:id" element={<CategoryNewsPage />} />

                            <Route path="/vesti/:id" element={<NewsDetailPage />} />
                            <Route path="/tagovi/:value" element={<TagPage />} />

                            <Route path="/cms/users" element={<AdminRoute element={<CmsUsersPage />} />} />
                            <Route path="/cms/users/new" element={<AdminRoute element={<CmsUserFormPage />} />} />
                            <Route path="/cms/users/:id/edit" element={<AdminRoute element={<CmsUserFormPage />} />} />
                            <Route path="/cms/categories" element={<PrivateRoute element={<CmsCategoriesPage />} />} />
                            <Route path="/cms/categories/new" element={<PrivateRoute element={<CmsCategoryFormPage />} />} />
                            <Route path="/cms/categories/:id/edit" element={<PrivateRoute element={<CmsCategoryFormPage />} />} />
                            <Route path="/cms/news" element={<PrivateRoute element={<CmsNewsListPage />} />} />
                            <Route path="/cms/news/new" element={<PrivateRoute element={<CmsNewsFormPage />} />} />
                            <Route path="/cms/news/:id/edit" element={<PrivateRoute element={<CmsNewsFormPage />} />} />
                        </Routes>
                    </Suspense>
                </main>
            </Router>
        </div>
    );
}

export default App;
