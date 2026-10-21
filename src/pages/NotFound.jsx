import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container className="page-header text-center" style={{ minHeight: '60vh' }}>
      <div className="display-1 fw-bold text-gradient">404</div>
      <p className="lead text-body-secondary">That page drifted out of range.</p>
      <Button as={Link} to="/" className="btn-glow">
        Back home
      </Button>
    </Container>
  );
}
