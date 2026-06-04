import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Spinner } from 'react-bootstrap';
import _axios from '../axiosInstance';

const TopReactionsSidebar = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        _axios.get('/api/news/top-reactions?limit=3')
            .then((response) => {
                setNews(response.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju top reakcija:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="mb-4 text-center">
                <Spinner animation="border" size="sm" />
            </div>
        );
    }

    if (news.length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            <h5 className="mb-3">🔥 Najpopularnije</h5>
            {news.map((item) => {
                const totalReactions = (item.likes || 0) + (item.dislikes || 0);
                return (
                    <Card key={item.id} className="mb-2">
                        <Card.Body>
                            <Card.Title
                                as={Link}
                                to={`/vesti/${item.id}`}
                                className="text-decoration-none text-dark"
                                style={{ fontSize: '1rem' }}
                            >
                                {item.title}
                            </Card.Title>
                            <Card.Subtitle className="text-muted small mt-1">
                                {item.categoryName}
                            </Card.Subtitle>
                            <div className="mt-2">
                                <Badge bg="success" className="me-1">👍 {item.likes || 0}</Badge>
                                <Badge bg="danger" className="me-1">👎 {item.dislikes || 0}</Badge>
                                <Badge bg="secondary">Ukupno: {totalReactions}</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
};

export default TopReactionsSidebar;
