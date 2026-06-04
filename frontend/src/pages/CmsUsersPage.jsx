import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal, Pagination, Badge } from 'react-bootstrap';
import _axios from '../axiosInstance';

const PAGE_SIZE = 10;

// CMS stranica za upravljanje korisnicima (admin only).
// Tabela sa paginacijom, akcije:
//  - Izmeni (svi)
//  - Aktiviraj/Deaktiviraj (SAMO za CREATOR-e; admin je uvek aktivan po spec-u)
const CmsUsersPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [toggleTarget, setToggleTarget] = useState(null);
    const [toggleError, setToggleError] = useState('');
    const [toggling, setToggling] = useState(false);

    const loadUsers = (page) => {
        setLoading(true);
        setError('');
        _axios.get(`/api/users?page=${page}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setUsers(response.data.users || []);
                setTotalCount(response.data.totalCount || 0);
                setCurrentPage(response.data.page || page);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju korisnika:', err);
                setError(err.response?.status === 403
                    ? 'Nemate dozvolu (samo admin moze da vidi listu korisnika).'
                    : 'Greska pri ucitavanju.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage]);

    const handleToggleClick = (user) => {
        setToggleTarget(user);
        setToggleError('');
    };

    const handleToggleConfirm = async () => {
        if (!toggleTarget) return;
        setToggling(true);
        setToggleError('');
        try {
            await _axios.put(`/api/users/${toggleTarget.id}/status`);
            setToggleTarget(null);
            loadUsers(currentPage);
        } catch (err) {
            console.error('Greska pri promeni statusa:', err);
            if (err.response?.status === 403) {
                setToggleError('Nemate dozvolu (samo admin).');
            } else {
                setToggleError('Greska pri promeni statusa.');
            }
        } finally {
            setToggling(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const isCreator = (u) => u.userType === 'CREATOR';
    const willDeactivate = toggleTarget && toggleTarget.status;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Korisnici</h1>
                <Button as={Link} to="/cms/users/new" variant="success">
                    + Dodaj korisnika
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Ime i prezime</th>
                                <th>Email</th>
                                <th style={{ width: '160px' }}>Tip</th>
                                <th style={{ width: '110px' }}>Status</th>
                                <th style={{ width: '230px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">Nema korisnika.</td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name} {u.surname}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <Badge bg={u.userType === 'ADMIN' ? 'danger' : 'primary'}>
                                            {u.userType === 'ADMIN' ? 'Administrator' : 'Stvaralac'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={u.status ? 'success' : 'secondary'}>
                                            {u.status ? 'aktivan' : 'neaktivan'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => navigate(`/cms/users/${u.id}/edit`)}
                                        >
                                            Izmeni
                                        </Button>
                                        {isCreator(u) && (
                                            <Button
                                                size="sm"
                                                variant={u.status ? 'outline-warning' : 'outline-success'}
                                                onClick={() => handleToggleClick(u)}
                                            >
                                                {u.status ? 'Deaktiviraj' : 'Aktiviraj'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            />
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Pagination.Item
                                    key={p}
                                    active={p === currentPage}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            />
                        </Pagination>
                    )}

                    <div className="text-muted text-center">
                        Ukupno: {totalCount} {totalCount === 1 ? 'korisnik' : 'korisnika'}
                    </div>
                </>
            )}

            <Modal show={!!toggleTarget} onHide={() => setToggleTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {willDeactivate ? 'Deaktivacija korisnika' : 'Aktivacija korisnika'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {toggleError && <Alert variant="danger">{toggleError}</Alert>}
                    Da li ste sigurni da zelite da {willDeactivate ? 'deaktivirate' : 'aktivirate'} korisnika{' '}
                    <strong>{toggleTarget?.name} {toggleTarget?.surname}</strong>?
                    {willDeactivate && (
                        <>
                            <br />
                            <small className="text-muted">
                                Deaktivirani korisnik nece moci da se prijavi u CMS.
                            </small>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setToggleTarget(null)} disabled={toggling}>
                        Odustani
                    </Button>
                    <Button
                        variant={willDeactivate ? 'warning' : 'success'}
                        onClick={handleToggleConfirm}
                        disabled={toggling}
                    >
                        {toggling
                            ? 'Menjam...'
                            : willDeactivate ? 'Deaktiviraj' : 'Aktiviraj'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CmsUsersPage;
