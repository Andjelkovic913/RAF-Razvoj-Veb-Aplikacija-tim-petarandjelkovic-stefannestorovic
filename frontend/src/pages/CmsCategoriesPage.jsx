import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal, Pagination } from 'react-bootstrap';
import _axios from '../axiosInstance';

const PAGE_SIZE = 10;

const CmsCategoriesPage = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [deleteTarget, setDeleteTarget] = useState(null);  // {id, name} ili null
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const loadCategories = (page) => {
        setLoading(true);
        setError('');
        _axios.get(`/api/categories?page=${page}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setCategories(response.data.categories || []);
                setTotalCount(response.data.totalCount || 0);
                setCurrentPage(response.data.page || page);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorija:', err);
                setError('Greska pri ucitavanju kategorija.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadCategories(currentPage);
    }, [currentPage]);

    const handleDeleteClick = (category) => {
        setDeleteTarget(category);
        setDeleteError('');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await _axios.delete(`/api/categories/${deleteTarget.id}`);
            setDeleteTarget(null);
            // Posle brisanja, refresh - ako smo na stranici sa samo 1 stavkom, idi na prethodnu
            const remainingOnPage = categories.length - 1;
            if (remainingOnPage === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                loadCategories(currentPage);
            }
        } catch (err) {
            console.error('Greska pri brisanju:', err);
            if (err.response?.status === 409) {
                setDeleteError(err.response.data?.message || 'Kategorija sadrzi vesti i ne moze se obrisati.');
            } else {
                setDeleteError('Greska pri brisanju.');
            }
        } finally {
            setDeleting(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Kategorije</h1>
                <Button as={Link} to="/cms/categories/new" variant="success">
                    + Dodaj kategoriju
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
                                <th>Ime</th>
                                <th>Opis</th>
                                <th style={{ width: '180px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr><td colSpan="4" className="text-center text-muted">Nema kategorija.</td></tr>
                            ) : categories.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>
                                        <Link to={`/cms/news?categoryId=${c.id}`} title="Prikazi vesti iz ove kategorije">
                                            {c.name}
                                        </Link>
                                    </td>
                                    <td>{c.description}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => navigate(`/cms/categories/${c.id}/edit`)}
                                        >
                                            Izmeni
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDeleteClick(c)}
                                        >
                                            Obrisi
                                        </Button>
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
                        Ukupno: {totalCount} kategorija
                    </div>
                </>
            )}

            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    Da li ste sigurni da zelite da obrisete kategoriju <strong>{deleteTarget?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                        Odustani
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
                        {deleting ? 'Brisem...' : 'Obrisi'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CmsCategoriesPage;
