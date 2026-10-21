import { Container } from 'react-bootstrap';
import { profile } from '../data/profile.js';

export default function Footer() {
  const { links } = profile;
  return (
    <footer className="site-footer py-5 mt-5">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="text-body-secondary small">
          © {new Date().getFullYear()} {profile.name}
        </div>
        <div className="d-flex gap-3 social-links">
          <a href={`mailto:${links.email}`} aria-label="Email">
            <i className="bi bi-envelope" />
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <i className="bi bi-github" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="bi bi-linkedin" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
