import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Pagination } from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';

const PAGE_SIZE = 10;

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [news, setNews] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    useEffect(() => {
        if (!query.trim()) {
            setNews([]);
            setTotalCount(0);
            return;
        }

        setLoading(true);
        setError('');

        _axios.get(`/api/news/search?q=${encodeURIComponent(query)}&page=${currentPage}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setNews(response.data.news || []);
                setTotalCount(response.data.totalCount || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri pretrazi:', err);
                if (err.response?.status === 400) {
                    setError('Unesite pojam za pretragu.');
                } else {
                    setError('Greska pri pretrazi.');
                }
                setLoading(false);
            });
    }, [query, currentPage]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <Container className="mt-4">
            <h1 className="mb-3">Pretraga</h1>
            {query.trim() ? (
                <p className="text-muted">
                    Rezultati za: <strong>"{query}"</strong>
                </p>
            ) : (
                <Alert variant="info">
                    Unesite pojam za pretragu u polju u navigaciji.
                </Alert>
            )}

            <Row>
                <Col md={8}>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : query.trim() && news.length === 0 ? (
                        <Alert variant="info">
                            Nema rezultata za "<strong>{query}</strong>".
                        </Alert>
                    ) : news.length > 0 ? (
                        <>
                            <p className="text-muted">
                                Pronadjeno {totalCount} {totalCount === 1 ? 'vest' : 'vesti'}.
                            </p>
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
                                            {item.text.length > 250
                                                ? item.text.slice(0, 250) + '...'
                                                : item.text}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <div>
                                                {item.tags?.map((tag) => (
                                                    <Badge key={tag.id} bg="secondary" className="me-1">
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
                        </>
                    ) : null}
                </Col>

                <Col md={4}>
                    <TopReactionsSidebar />
                </Col>
            </Row>
        </Container>
    );
};

export default SearchPage;
