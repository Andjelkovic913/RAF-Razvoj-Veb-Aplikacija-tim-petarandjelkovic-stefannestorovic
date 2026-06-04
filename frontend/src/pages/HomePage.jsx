import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import _axios from '../axiosInstance';
import TopReactionsSidebar from '../components/TopReactionsSidebar';

const HomePage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        _axios.get('/api/news?page=1&pageSize=10')
            .then((response) => {
                setNews(response.data.news || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju vesti:', err);
                setError('Backend nije dostupan. Proveri da li je pokrenut server?');
                setLoading(false);
            });
    }, []);

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

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Najnovije vesti</h1>
            <Row>
                <Col md={8}>
                    {news.map((item) => (
                        <Card key={item.id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {item.categoryName} • {item.authorName} • {new Date(item.publishedTime).toLocaleDateString('sr-RS')}
                                </Card.Subtitle>
                                <Card.Text>
                                    {item.text.length > 200 ? item.text.slice(0, 200) + '...' : item.text}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
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
                </Col>

                <Col md={4}>
                    <TopReactionsSidebar />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
