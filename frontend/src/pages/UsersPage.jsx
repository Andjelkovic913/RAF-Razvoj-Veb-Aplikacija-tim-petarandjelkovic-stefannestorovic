import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import _axios from '../axiosInstance';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        _axios.get('/api/users?page=1&pageSize=20')
            .then((response) => {
                setUsers(response.data.users || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greska pri ucitavanju korisnika:', err);
                setError(err.response?.status === 403
                    ? 'Nemate dozvolu (samo admin moze da vidi listu korisnika).'
                    : 'Greska pri ucitavanju.');
                setLoading(false);
            });
    }, []);

    if (loading)
        return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error)
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Korisnici (admin only)</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Tip</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{u.name}</td>
                            <td>{u.surname}</td>
                            <td>
                                <Badge bg={u.userType === 'ADMIN' ? 'danger' : 'primary'}>
                                    {u.userType}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={u.status ? 'success' : 'secondary'}>
                                    {u.status ? 'aktivan' : 'neaktivan'}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default UsersPage;
