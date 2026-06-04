import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, Spinner, Alert, Badge, Pagination,
} from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';

const PAGE_SIZE = 10;

const TagPage = () => {
    const { value } = useParams();

    const [news, setNews] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [value]);

    useEffect(() => {
        if (!value) return;
        setLoading(true);
        setError('');
        _axios.get(`/api/news/by-tag/${encodeURIComponent(value)}?page=${currentPage}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setNews(response.data.news || []);
                setTotalCount(response.data.totalCount || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju vesti po tagu:', err);
                setError('Greska pri ucitavanju vesti.');
                setLoading(false);
            });
    }, [value, currentPage]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <Container className="mt-4">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start">
                    <h1>#{value}</h1>
                    <Badge bg="primary" pill style={{ fontSize: '0.9rem' }}>
                        {totalCount} {totalCount === 1 ? 'vest' : 'vesti'}
                    </Badge>
                </div>
                <p className="text-muted">Sve vesti sa tagom <strong>#{value}</strong>.</p>
            </div>

            <Row>
                <Col md={8}>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : news.length === 0 ? (
                        <Alert variant="info">Nema vesti sa ovim tagom.</Alert>
                    ) : (
                        <>
                            {news.map((item) => (
                                <Card key={item.id} className="mb-3">
                                    <Card.Body>
                                        <Card.Title
                                            as={Link}
                                            to={`/vesti/${item.id}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            {item.title}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {item.categoryName} • {item.authorName} • {new Date(item.publishedTime).toLocaleDateString('sr-RS')}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {item.text.length > 200
                                                ? item.text.slice(0, 200) + '...'
                                                : item.text}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <div>
                                                {item.tags?.map((tag) => (
                                                    <Link
                                                        key={tag.id}
                                                        to={`/tagovi/${encodeURIComponent(tag.value)}`}
                                                        className="text-decoration-none me-1"
                                                    >
                                                        <Badge bg={tag.value === value ? 'primary' : 'secondary'}>
                                                            #{tag.value}
                                                        </Badge>
                                                    </Link>
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

export default TagPage;
