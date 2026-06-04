import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Container, Table, Button, Spinner, Alert, Modal, Pagination, Form, Badge,
} from 'react-bootstrap';
import _axios from '../axiosInstance';
import { getCurrentUser, isAdmin } from '../auth.js';

const PAGE_SIZE = 10;

const CmsNewsListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentUser = getCurrentUser();
    const admin = isAdmin();

    const queryParam = searchParams.get('q') || '';
    const categoryIdParam = searchParams.get('categoryId') || '';

    const [news, setNews] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchInput, setSearchInput] = useState(queryParam);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filterCategoryName, setFilterCategoryName] = useState('');

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [queryParam, categoryIdParam]);

    useEffect(() => {
        setSearchInput(queryParam);
    }, [queryParam]);

    useEffect(() => {
        if (!categoryIdParam) {
            setFilterCategoryName('');
            return;
        }
        _axios.get(`/api/categories/${categoryIdParam}`)
            .then((response) => setFilterCategoryName(response.data?.name || ''))
            .catch(() => setFilterCategoryName(''));
    }, [categoryIdParam]);

    useEffect(() => {
        setLoading(true);
        setError('');

        let url;
        if (queryParam.trim()) {
            url = `/api/news/search?q=${encodeURIComponent(queryParam)}&page=${currentPage}&pageSize=${PAGE_SIZE}`;
        } else if (categoryIdParam) {
            url = `/api/news/by-category/${categoryIdParam}?page=${currentPage}&pageSize=${PAGE_SIZE}`;
        } else {
            url = `/api/news?page=${currentPage}&pageSize=${PAGE_SIZE}`;
        }

        _axios.get(url)
            .then((response) => {
                setNews(response.data.news || []);
                setTotalCount(response.data.totalCount || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju vesti:', err);
                setError('Greska pri ucitavanju vesti.');
                setLoading(false);
            });
    }, [currentPage, queryParam, categoryIdParam]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = searchInput.trim();
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const handleDeleteClick = (item) => {
        setDeleteTarget(item);
        setDeleteError('');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await _axios.delete(`/api/news/${deleteTarget.id}`);
            setDeleteTarget(null);

            const remainingOnPage = news.length - 1;
            if (remainingOnPage === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setCurrentPage((p) => p);
                const url = queryParam.trim()
                    ? `/api/news/search?q=${encodeURIComponent(queryParam)}&page=${currentPage}&pageSize=${PAGE_SIZE}`
                    : categoryIdParam
                        ? `/api/news/by-category/${categoryIdParam}?page=${currentPage}&pageSize=${PAGE_SIZE}`
                        : `/api/news?page=${currentPage}&pageSize=${PAGE_SIZE}`;
                const response = await _axios.get(url);
                setNews(response.data.news || []);
                setTotalCount(response.data.totalCount || 0);
            }
        } catch (err) {
            console.error('Greska pri brisanju:', err);
            if (err.response?.status === 403) {
                setDeleteError('Nemate dozvolu da obrisete ovu vest.');
            } else if (err.response?.status === 404) {
                setDeleteError('Vest ne postoji.');
            } else {
                setDeleteError('Greska pri brisanju.');
            }
        } finally {
            setDeleting(false);
        }
    };

    const canEdit = (item) => admin || (currentUser && item.authorId === currentUser.userId);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const hasActiveFilter = queryParam.trim() || categoryIdParam;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Vesti</h1>
                <Button as={Link} to="/cms/news/new" variant="success">
                    + Dodaj vest
                </Button>
            </div>

            {/* Search bar */}
            <Form onSubmit={handleSearchSubmit} className="mb-3">
                <div className="d-flex gap-2">
                    <Form.Control
                        type="search"
                        placeholder="Pretraga po naslovu ili tekstu..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button type="submit" variant="primary">Pretrazi</Button>
                    {hasActiveFilter && (
                        <Button variant="outline-secondary" onClick={handleClearFilters}>
                            Ocisti
                        </Button>
                    )}
                </div>
            </Form>

            {queryParam.trim() && (
                <Alert variant="info" className="py-2">
                    Pretraga: <strong>"{queryParam}"</strong>
                </Alert>
            )}
            {!queryParam.trim() && categoryIdParam && (
                <Alert variant="info" className="py-2">
                    Filter po kategoriji: <strong>{filterCategoryName || `#${categoryIdParam}`}</strong>
                </Alert>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Naslov</th>
                                <th style={{ width: '150px' }}>Autor</th>
                                <th style={{ width: '150px' }}>Kategorija</th>
                                <th style={{ width: '140px' }}>Datum objave</th>
                                <th style={{ width: '180px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        {hasActiveFilter ? 'Nema rezultata.' : 'Nema vesti.'}
                                    </td>
                                </tr>
                            ) : news.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.authorName}</td>
                                    <td>
                                        <Badge bg="secondary">{item.categoryName}</Badge>
                                    </td>
                                    <td>
                                        {new Date(item.publishedTime).toLocaleDateString('sr-RS')}
                                    </td>
                                    <td>
                                        {canEdit(item) ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    className="me-2"
                                                    onClick={() => navigate(`/cms/news/${item.id}/edit`)}
                                                >
                                                    Izmeni
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDeleteClick(item)}
                                                >
                                                    Obrisi
                                                </Button>
                                            </>
                                        ) : (
                                            <small className="text-muted">—</small>
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
                        Ukupno: {totalCount} {totalCount === 1 ? 'vest' : 'vesti'}
                    </div>
                </>
            )}

            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    Da li ste sigurni da zelite da obrisete vest <strong>{deleteTarget?.title}</strong>?
                    <br />
                    <small className="text-muted">
                        Svi komentari vezani za ovu vest ce takodje biti obrisani.
                    </small>
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

export default CmsNewsListPage;
