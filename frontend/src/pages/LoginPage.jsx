import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import _axios from '../axiosInstance';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        try {
            const response = await _axios.post('/api/users/login', { email, password });
            console.log('Login uspesan:', response.data);
            localStorage.setItem('jwt', response.data.jwt);
            navigate('/');
            // Hard reload da NavigationBar pokupi novo stanje (admin link itd.)
            window.location.reload();
        } catch (error) {
            const msg = error.response?.data?.error || 'Greska pri prijavi';
            setErrorMessage(msg);
            console.error('Login failed', error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Prijava</h2>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                <Form onSubmit={login}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="admin@raf.rs"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="lozinka"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">
                        Prijavi se
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default LoginPage;
