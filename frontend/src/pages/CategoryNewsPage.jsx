import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, Spinner, Alert, Badge, Pagination, Breadcrumb,
} from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';

const PAGE_SIZE = 10;

const CategoryNewsPage = () => {
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [news, setNews] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        _axios.get(`/api/categories/${id}`)
            .then((response) => setCategory(response.data))
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorije:', err);
                if (err.response?.status === 404) {
                    setError('Kategorija ne postoji.');
                } else {
                    setError('Greska pri ucitavanju kategorije.');
                }
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        setCurrentPage(1);
    }, [id]);

    useEffect(() => {
        if (error) return;
        setLoading(true);
        _axios.get(`/api/news/by-category/${id}?page=${currentPage}&pageSize=${PAGE_SIZE}`)
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
    }, [id, currentPage, error]);

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Link to="/kategorije" className="btn btn-outline-primary">
                    ← Nazad na sve kategorije
                </Link>
            </Container>
        );
    }

    if (loading && !category) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <Container className="mt-4">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                    Pocetna
                </Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/kategorije' }}>
                    Kategorije
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{category?.name}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start">
                    <h1>{category?.name}</h1>
                    <Badge bg="primary" pill style={{ fontSize: '0.9rem' }}>
                        {totalCount} {totalCount === 1 ? 'vest' : 'vesti'}
                    </Badge>
                </div>
                <p className="text-muted">{category?.description}</p>
            </div>

            <Row>
                <Col md={8}>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" /></div>
                    ) : news.length === 0 ? (
                        <Alert variant="info">
                            U ovoj kategoriji jos uvek nema vesti.
                        </Alert>
                    ) : (
                        <>
                            {news.map((item) => (
                                <Card key={item.id} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {item.authorName} • {new Date(item.publishedTime).toLocaleDateString('sr-RS')}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {item.text.length > 200
                                                ? item.text.slice(0, 200) + '...'
                                                : item.text}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                {item.tags?.map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        bg="secondary"
                                                        className="me-1"
                                                    >
                                                        {tag.value}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <small className="text-muted">
                                                👁 {item.numberOfVisits} • 👍 {item.likes} • 👎 {item.dislikes}
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

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
                        </>
                    )}
                </Col>

                <Col md={4}>
                    <TopReactionsSidebar />
                </Col>
            </Row>
        </Container>
    );
};

export default CategoryNewsPage;
