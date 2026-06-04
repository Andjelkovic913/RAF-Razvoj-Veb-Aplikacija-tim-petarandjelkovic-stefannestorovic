import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';

const NajcitanijePage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        _axios.get('/api/news/most-read?days=30&limit=10')
            .then((response) => {
                setNews(response.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju najcitanijih:', err);
                setError('Greska pri ucitavanju.');
                setLoading(false);
            });
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Najcitanije u poslednjih 30 dana</h1>

            <Row>
                <Col md={8}>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : news.length === 0 ? (
                        <Alert variant="info">Nema vesti objavljenih u poslednjih 30 dana.</Alert>
                    ) : (
                        news.map((item, idx) => (
                            <Card key={item.id} className="mb-3">
                                <Card.Body className="d-flex">
                                    <div
                                        style={{
                                            fontSize: '3rem',
                                            fontWeight: 'bold',
                                            color: idx < 3 ? '#0d6efd' : '#6c757d',
                                            marginRight: '1rem',
                                            minWidth: '70px',
                                            textAlign: 'center',
                                            lineHeight: 1,
                                        }}
                                    >
                                        #{idx + 1}
                                    </div>

                                    <div style={{ flex: 1 }}>
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
                                                    <Link
                                                        key={tag.id}
                                                        to={`/tagovi/${encodeURIComponent(tag.value)}`}
                                                        className="text-decoration-none me-1"
                                                    >
                                                        <Badge bg="secondary">#{tag.value}</Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                            <small className="text-muted">
                                                👁 {item.numberOfVisits} • 👍 {item.likes} • 👎 {item.dislikes}
                                            </small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>

                <Col md={4}>
                    <TopReactionsSidebar />
                </Col>
            </Row>
        </Container>
    );
};

export default NajcitanijePage;
