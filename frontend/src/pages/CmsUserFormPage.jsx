import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../axiosInstance';

const CmsUserFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('CREATOR');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        _axios.get(`/api/users/${id}`)
            .then((response) => {
                const u = response.data;
                setName(u.name || '');
                setSurname(u.surname || '');
                setEmail(u.email || '');
                setUserType(u.userType || 'CREATOR');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju korisnika:', err);
                if (err.response?.status === 404) {
                    setError('Korisnik ne postoji.');
                } else if (err.response?.status === 403) {
                    setError('Nemate dozvolu (samo admin).');
                } else {
                    setError('Greska pri ucitavanju.');
                }
                setLoading(false);
            });
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isEdit && password !== confirmPassword) {
            setError('Lozinke se ne poklapaju.');
            return;
        }

        setSaving(true);

        try {
            if (isEdit) {
                const body = {
                    name: name.trim(),
                    surname: surname.trim(),
                    email: email.trim(),
                    userType,
                };
                await _axios.put(`/api/users/${id}`, body);
            } else {
                const body = {
                    name: name.trim(),
                    surname: surname.trim(),
                    email: email.trim(),
                    userType,
                    password,
                    confirmPassword,
                };
                await _axios.post('/api/users', body);
            }
            navigate('/cms/users');
        } catch (err) {
            console.error('Greska pri snimanju:', err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.response?.data?.error;

            if (status === 409) {
                setError(msg || 'Korisnik sa tim email-om vec postoji.');
            } else if (status === 400) {
                setError(msg || 'Neispravni podaci. Proveri sva polja.');
            } else if (status === 403) {
                setError('Nemate dozvolu (samo admin).');
            } else if (status === 404) {
                setError('Korisnik ne postoji.');
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
                <h2 className="mb-4">{isEdit ? 'Izmena korisnika' : 'Novi korisnik'}</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Ime *</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={100}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Prezime *</Form.Label>
                        <Form.Control
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                            maxLength={100}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            maxLength={255}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tip korisnika *</Form.Label>
                        <Form.Select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        >
                            <option value="CREATOR">Stvaralac sadrzaja</option>
                            <option value="ADMIN">Administrator</option>
                        </Form.Select>
                    </Form.Group>

                    {!isEdit && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Lozinka *</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Potvrda lozinke *</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    isInvalid={confirmPassword.length > 0 && password !== confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Lozinke se ne poklapaju.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate('/cms/users')} disabled={saving}>
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

export default CmsUserFormPage;
