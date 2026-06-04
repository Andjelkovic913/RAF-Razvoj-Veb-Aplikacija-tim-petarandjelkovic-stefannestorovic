import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown, Form, FormControl } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, getCurrentUser, logout } from "../auth.js";
import _axios from "../axiosInstance";

const TOP_N = 5;

const MAX_IN_DROPDOWN = 5;

const NavigationBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            navigate(`/pretraga?q=${encodeURIComponent(q)}`);
            setSearchQuery("");
        }
    };

    useEffect(() => {
        _axios.get("/api/categories/all")
            .then((response) => setCategories(response.data || []))
            .catch((err) => {
                console.error("Greska pri ucitavanju kategorija:", err);
                setCategories([]);
            });
    }, []);

    const topCategories = categories.slice(0, TOP_N);
    const remainingCategories = categories.slice(TOP_N);

    const overflow = remainingCategories.length > MAX_IN_DROPDOWN;
    const dropdownCategories = overflow
        ? remainingCategories.slice(0, MAX_IN_DROPDOWN)
        : remainingCategories;

    const isCategoryActive = (id) => location.pathname === `/kategorije/${id}`;

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">RAF Novosti</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
                            Pocetna
                        </Nav.Link>
                        <Nav.Link as={Link} to="/najcitanije" className={location.pathname === "/najcitanije" ? "active" : ""}>
                            Najcitanije
                        </Nav.Link>

                        {topCategories.map((c) => (
                            <Nav.Link
                                key={c.id}
                                as={Link}
                                to={`/kategorije/${c.id}`}
                                className={isCategoryActive(c.id) ? "active" : ""}
                                title={`${c.newsCount} vesti`}
                            >
                                {c.name}
                            </Nav.Link>
                        ))}

                        {remainingCategories.length > 0 && (
                            <NavDropdown title="Vise" id="more-categories-dropdown">
                                {dropdownCategories.map((c) => (
                                    <NavDropdown.Item
                                        key={c.id}
                                        as={Link}
                                        to={`/kategorije/${c.id}`}
                                        active={isCategoryActive(c.id)}
                                    >
                                        {c.name}
                                        <span className="text-muted ms-2">({c.newsCount})</span>
                                    </NavDropdown.Item>
                                ))}
                                {overflow && (
                                    <>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/kategorije">
                                            <strong>Sve kategorije →</strong>
                                        </NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        )}
                    </Nav>

                    <Form onSubmit={handleSearch} className="d-flex me-3">
                        <FormControl
                            type="search"
                            placeholder="Pretraga vesti..."
                            size="sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="me-2"
                            style={{ minWidth: "200px" }}
                        />
                        <Button type="submit" variant="light" size="sm">
                            Pretrazi
                        </Button>
                    </Form>

                    <Nav className="align-items-center">
                        {isAuthenticated() && (
                            <NavDropdown title="CMS" id="cms-dropdown" align="end">
                                <NavDropdown.Item
                                    as={Link}
                                    to="/cms/categories"
                                    active={location.pathname.startsWith("/cms/categories")}
                                >
                                    Kategorije
                                </NavDropdown.Item>
                                {isAdmin() && (
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/cms/users"
                                        active={location.pathname === "/cms/users"}
                                    >
                                        Korisnici
                                    </NavDropdown.Item>
                                )}
                            </NavDropdown>
                        )}

                        {isAuthenticated() ? (
                            <>
                                <Navbar.Text className="me-3 text-nowrap">
                                    {user?.sub} ({user?.role})
                                </Navbar.Text>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => logout(navigate)}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="success"
                                size="sm"
                                as={Link}
                                to="/login"
                            >
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
