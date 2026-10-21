import { useMemo, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { categories, projects } from '../data/projects.js';

export default function AllProjects() {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (active !== 'all' && p.category !== active) return false;
      if (!q) return true;
      return [p.title, p.summary, ...p.tech].join(' ').toLowerCase().includes(q);
    });
  }, [active, query]);

  return (
    <>
      <header className="page-header">
        <Container>
          <h1 className="display-6 fw-bold animate-in">All projects</h1>
          <p className="lead text-body-secondary animate-in" style={{ animationDelay: '120ms' }}>
            Filter by category or search by name or technology.
          </p>
          <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center animate-in" style={{ animationDelay: '200ms' }}>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className={`filter-pill ${active === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>
                All
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`filter-pill ${active === c.id ? 'active' : ''}`}
                  style={{ '--accent': c.accent }}
                  onClick={() => setActive(c.id)}
                >
                  <i className={`bi ${c.icon} me-1`} />
                  {c.title}
                </button>
              ))}
            </div>
            <Form.Control
              type="search"
              placeholder="Search e.g. ROS 2, OCT, PyTorch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ms-lg-auto search-input"
              aria-label="Search projects"
            />
          </div>
        </Container>
      </header>

      <section className="py-5">
        <Container>
          {visible.length === 0 ? (
            <p className="text-body-secondary">No projects match that search.</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {visible.map((p, i) => (
                <Col key={`${active}-${p.slug}`}>
                  <Reveal delay={(i % 3) * 70} className="h-100">
                    <ProjectCard project={p} showCategory />
                  </Reveal>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}
