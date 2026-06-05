import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Pagination } from 'react-bootstrap';
import _axios from '../axiosInstance';

const PAGE_SIZE = 10;

const AllCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        _axios.get(`/api/categories?page=${currentPage}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setCategories(response.data.categories || []);
                setTotalCount(response.data.totalCount || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorija:', err);
                setError('Greska pri ucitavanju kategorija.');
                setLoading(false);
            });
    }, [currentPage]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Sve kategorije</h1>
            <p className="text-muted mb-4">
                Ukupno {totalCount} kategorija. Kliknite na kategoriju da vidite njene vesti.
            </p>

            <Row>
                {categories.map((c) => (
                    <Col key={c.id} md={6} lg={4} className="mb-3">
                        <Card
                            as={Link}
                            to={`/kategorije/${c.id}`}
                            className="h-100 text-decoration-none text-dark"
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Card.Title className="mb-0">{c.name}</Card.Title>
                                    <Badge bg={c.newsCount > 0 ? 'primary' : 'secondary'}>
                                        {c.newsCount} {c.newsCount === 1 ? 'vest' : 'vesti'}
                                    </Badge>
                                </div>
                                <Card.Text className="text-muted">
                                    {c.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
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
        </Container>
    );
};

export default AllCategoriesPage;
