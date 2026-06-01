import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, getCurrentUser, logout } from "../auth.js";

const NavigationBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">RAF Novosti</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
                            Home
                        </Nav.Link>
                        {isAdmin() && (
                            <Nav.Link as={Link} to="/users" className={location.pathname === "/users" ? "active" : ""}>
                                Korisnici
                            </Nav.Link>
                        )}
                    </Nav>

                    {isAuthenticated() ? (
                        <>
                            <span className="text-light me-3">
                                {user?.sub} ({user?.role})
                            </span>
                            <Button variant="danger" onClick={() => logout(navigate)}>Logout</Button>
                        </>
                    ) : (
                        <Button variant="success" as={Link} to="/login">Login</Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
