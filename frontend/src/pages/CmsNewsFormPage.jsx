import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../axiosInstance';

const CmsNewsFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        _axios.get('/api/categories/all')
            .then((response) => {
                setCategories(response.data || []);
                if (!isEdit) setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorija:', err);
                setError('Greska pri ucitavanju kategorija.');
                setLoading(false);
            });
    }, [isEdit]);

    useEffect(() => {
        if (!isEdit) return;
        _axios.get(`/api/news/${id}`)
            .then((response) => {
                const n = response.data;
                setTitle(n.title || '');
                setText(n.text || '');
                setCategoryId(n.categoryId ? String(n.categoryId) : '');
                setTagsInput((n.tags || []).map((t) => t.value).join(', '));
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju vesti:', err);
                if (err.response?.status === 404) {
                    setError('Vest ne postoji.');
                } else {
                    setError('Greska pri ucitavanju.');
                }
                setLoading(false);
            });
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        const tagValues = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        const body = {
            title: title.trim(),
            text: text.trim(),
            categoryId: Number(categoryId),
            tags: tagValues,
        };

        try {
            if (isEdit) {
                await _axios.put(`/api/news/${id}`, body);
            } else {
                await _axios.post('/api/news', body);
            }
            navigate('/cms/news');
        } catch (err) {
            console.error('Greska pri snimanju:', err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.response?.data?.error;

            if (status === 403) {
                setError('Nemate dozvolu da menjate ovu vest.');
            } else if (status === 404) {
                setError('Vest ne postoji.');
            } else if (status === 400) {
                setError(msg || 'Neispravni podaci. Proveri sva polja.');
            } else {
                setError('Greska pri snimanju.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <Card className="p-4 shadow-sm">
                <h2 className="mb-4">{isEdit ? 'Izmena vesti' : 'Nova vest'}</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Naslov *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Naslov vesti"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={255}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kategorija *</Form.Label>
                        <Form.Select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Izaberi kategoriju --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tekst *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            placeholder="Tekst vesti"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tagovi</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="npr. sport, NBA, Jokic"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Razdvojeni zarezom. Ostavite prazno ako nema tagova.
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate('/cms/news')} disabled={saving}>
                            Odustani
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Snimam...' : isEdit ? 'Sacuvaj izmene' : 'Dodaj'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default CmsNewsFormPage;
