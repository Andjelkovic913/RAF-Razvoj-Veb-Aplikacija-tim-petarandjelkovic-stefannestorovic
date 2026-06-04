import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../axiosInstance';

const CmsCategoryFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        _axios.get(`/api/categories/${id}`)
            .then((response) => {
                setName(response.data.name || '');
                setDescription(response.data.description || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju kategorije:', err);
                if (err.response?.status === 404) {
                    setError('Kategorija ne postoji.');
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

        const body = {
            name: name.trim(),
            description: description.trim(),
        };

        try {
            if (isEdit) {
                await _axios.put(`/api/categories/${id}`, body);
            } else {
                await _axios.post('/api/categories', body);
            }
            navigate('/cms/categories');
        } catch (err) {
            console.error('Greska pri snimanju:', err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.response?.data?.error;

            if (status === 409) {
                setError(msg || 'Kategorija sa tim imenom vec postoji.');
            } else if (status === 400) {
                setError(msg || 'Neispravni podaci. Proveri sva polja.');
            } else if (status === 404) {
                setError('Kategorija ne postoji.');
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
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <Card className="p-4 shadow-sm">
                <h2 className="mb-4">{isEdit ? 'Izmena kategorije' : 'Nova kategorija'}</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Ime kategorije *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="npr. Sport"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={100}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Opis *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Kratak opis kategorije"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            maxLength={500}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate('/cms/categories')} disabled={saving}>
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

export default CmsCategoryFormPage;
