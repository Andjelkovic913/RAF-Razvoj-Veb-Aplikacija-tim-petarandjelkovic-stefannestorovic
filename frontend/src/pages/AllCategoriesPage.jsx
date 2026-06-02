import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import _axios from '../axiosInstance';

const AllCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        _axios.get('/api/categories/with-counts')
            .then((response) => {
                setCategories(response.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorija:', err);
                setError('Greska pri ucitavanju kategorija.');
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
            <h1 className="mb-4">Sve kategorije</h1>
            <p className="text-muted mb-4">
                Ukupno {categories.length} kategorija. Kliknite na kategoriju da vidite njene vesti.
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
        </Container>
    );
};

export default AllCategoriesPage;
