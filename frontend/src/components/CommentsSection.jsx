import { useEffect, useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import _axios from '../axiosInstance';

const PAGE_SIZE = 10;

const CommentsSection = ({ newsId }) => {
    const [comments, setComments] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formName, setFormName] = useState('');
    const [formText, setFormText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const loadComments = (page) => {
        setLoading(true);
        setError('');
        _axios.get(`/api/news/${newsId}/comments?page=${page}&pageSize=${PAGE_SIZE}`)
            .then((response) => {
                setComments(response.data.comments || []);
                setTotalCount(response.data.totalCount || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju komentara:', err);
                setError('Greska pri ucitavanju komentara.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadComments(currentPage);
    }, [newsId, currentPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formName.trim() || !formText.trim()) {
            setFormError('Ime i komentar su obavezni.');
            return;
        }

        setSubmitting(true);
        try {
            await _axios.post(`/api/news/${newsId}/comments`, {
                authorName: formName.trim(),
                text: formText.trim(),
            });
            setFormName('');
            setFormText('');
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                loadComments(1);
            }
        } catch (err) {
            console.error('Greska pri slanju komentara:', err);
            const msg = err.response?.data?.message || err.response?.data?.error;
            if (err.response?.status === 400) {
                setFormError(msg || 'Neispravni podaci. Proveri sva polja.');
            } else {
                setFormError('Greska pri slanju komentara.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <section className="mt-5">
            <h3 className="mb-3">Komentari ({totalCount})</h3>

            <Card className="mb-4">
                <Card.Body>
                    <h5 className="mb-3">Ostavite komentar</h5>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vase ime *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                required
                                maxLength={100}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Komentar *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formText}
                                onChange={(e) => setFormText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={submitting}>
                            {submitting ? 'Saljem...' : 'Posalji komentar'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : comments.length === 0 ? (
                <Alert variant="info">Jos uvek nema komentara. Budite prvi!</Alert>
            ) : (
                <>
                    {comments.map((c) => (
                        <Card key={c.id} className="mb-2">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <strong>{c.authorName}</strong>
                                    <small className="text-muted">
                                        {new Date(c.createdAt).toLocaleString('sr-RS', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </small>
                                </div>
                                <p style={{ whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>
                                    {c.text}
                                </p>
                                <small className="text-muted">
                                    👍 {c.likes || 0} • 👎 {c.dislikes || 0}
                                </small>
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
        </section>
    );
};

export default CommentsSection;
