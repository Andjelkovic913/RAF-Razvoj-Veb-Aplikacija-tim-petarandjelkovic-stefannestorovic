import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, Spinner, Alert, Badge, Breadcrumb,
} from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';
import CommentsSection from '../components/CommentsSection';
import { getSessionId } from '../session';

const NewsDetailPage = () => {
    const { id } = useParams();

    const [news, setNews] = useState(null);
    const [related, setRelated] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        setNews(null);
        setRelated([]);

        _axios.get(`/api/news/${id}`)
            .then((response) => {
                setNews(response.data);
                setLoading(false);

                _axios.post(`/api/news/${id}/visit`, { sessionId: getSessionId() })
                    .then((visitResponse) => {
                        if (visitResponse.data?.newVisit) {
                            setNews((prev) => prev ? { ...prev, numberOfVisits: prev.numberOfVisits + 1 } : prev);
                        }
                    })
                    .catch((err) => console.error('Greska pri evidenciji posete:', err));
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju vesti:', err);
                if (err.response?.status === 404) {
                    setError('Vest ne postoji.');
                } else {
                    setError('Greska pri ucitavanju vesti.');
                }
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!news) return;
        _axios.get(`/api/news/${id}/related?limit=3`)
            .then((response) => setRelated(response.data || []))
            .catch((err) => {
                console.error('Greska pri ucitavanju povezanih vesti:', err);
                setRelated([]);
            });
    }, [id, news]);

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
                <Link to="/" className="btn btn-outline-primary">
                    ← Nazad na pocetnu
                </Link>
            </Container>
        );
    }

    if (!news) return null;

    return (
        <Container className="mt-4">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                    Pocetna
                </Breadcrumb.Item>
                {news.categoryId && (
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/kategorije/${news.categoryId}` }}>
                        {news.categoryName}
                    </Breadcrumb.Item>
                )}
                <Breadcrumb.Item active>{news.title}</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                <Col md={8}>
                    <article>
                        <h1 className="mb-3">{news.title}</h1>

                        <div className="text-muted mb-3">
                            {news.categoryId && (
                                <Link
                                    to={`/kategorije/${news.categoryId}`}
                                    className="text-decoration-none me-2"
                                >
                                    <Badge bg="primary">{news.categoryName}</Badge>
                                </Link>
                            )}
                            <span className="me-3">
                                <strong>{news.authorName}</strong>
                            </span>
                            <span className="me-3">
                                {new Date(news.publishedTime).toLocaleString('sr-RS', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                            <span>👁 {news.numberOfVisits}</span>
                        </div>

                        <hr />

                        <div style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.7' }}>
                            {news.text}
                        </div>

                        {news.tags && news.tags.length > 0 && (
                            <>
                                <hr />
                                <div>
                                    <strong className="me-2">Tagovi:</strong>
                                    {news.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            to={`/tagovi/${encodeURIComponent(tag.value)}`}
                                            className="text-decoration-none me-2"
                                        >
                                            <Badge bg="secondary">#{tag.value}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </article>

                    <CommentsSection newsId={news.id} />

                    {related.length > 0 && (
                        <section className="mt-5">
                            <h3 className="mb-3">Procitaj jos…</h3>
                            <Row>
                                {related.map((item) => (
                                    <Col key={item.id} md={4} className="mb-3">
                                        <Card className="h-100">
                                            <Card.Body>
                                                <Card.Title
                                                    as={Link}
                                                    to={`/vesti/${item.id}`}
                                                    className="text-decoration-none text-dark"
                                                    style={{ fontSize: '1rem' }}
                                                >
                                                    {item.title}
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted small mt-2">
                                                    {item.categoryName} • {new Date(item.publishedTime).toLocaleDateString('sr-RS')}
                                                </Card.Subtitle>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </section>
                    )}
                </Col>

                <Col md={4}>
                    <TopReactionsSidebar />
                </Col>
            </Row>
        </Container>
    );
};

export default NewsDetailPage;
