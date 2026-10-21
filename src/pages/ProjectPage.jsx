import { useState } from 'react';
import { Badge, Breadcrumb, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import Figure from '../components/Figure.jsx';
import Reveal from '../components/Reveal.jsx';
import { getCategory, getProject, projectsIn } from '../data/projects.js';
import { asset } from '../utils.js';
import NotFound from './NotFound.jsx';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const [lightbox, setLightbox] = useState(null);
  if (!project) return <NotFound />;

  const category = getCategory(project.category);
  const siblings = projectsIn(category.id);
  const idx = siblings.findIndex((p) => p.slug === project.slug);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];
  const imgDir = `public/images/projects/${project.slug}/`;

  const meta = [
    { icon: 'bi-calendar3', label: 'Timeline', value: project.period },
    { icon: 'bi-building', label: 'Affiliation', value: project.affiliation },
    { icon: 'bi-people', label: 'Role', value: project.role },
    { icon: 'bi-flag', label: 'Status', value: project.status },
  ].filter((m) => m.value);

  return (
    <div style={{ '--accent': category.accent }}>
      <header className="page-header project-header">
        <Container>
          <Breadcrumb className="mb-3">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/category/${category.id}` }}>{category.title}</Breadcrumb.Item>
            <Breadcrumb.Item active>{project.title}</Breadcrumb.Item>
          </Breadcrumb>
          <Link to={`/category/${category.id}`} className="category-chip mb-3 d-inline-flex animate-in">
            <i className={`bi ${category.icon} me-1`} />
            {category.title}
          </Link>
          <h1 className="display-5 fw-bold mb-3 animate-in" style={{ animationDelay: '100ms' }}>
            {project.title}
          </h1>
          <p className="lead text-body-secondary mb-0 animate-in" style={{ animationDelay: '180ms' }}>
            {project.summary}
          </p>
        </Container>
      </header>

      <Container className="py-5">
        <Row className="g-5">
          <Col lg={8}>
            <Reveal className="mb-5">
              <Figure
                src={project.cover}
                caption={project.cover ? null : 'Cover image'}
                hintPath={`${imgDir}cover.jpg`}
                accent={category.accent}
                onOpen={() => setLightbox({ src: project.cover, caption: project.title })}
              />
            </Reveal>

            <Reveal as="section" className="mb-5">
              <h2 className="section-title h3">Description</h2>
              {project.description.map((para) => (
                <p key={para.slice(0, 32)} className="project-prose">
                  {para}
                </p>
              ))}
            </Reveal>

            {project.subprojects?.length > 0 && (
              <section className="mb-5">
                <Reveal>
                  <h2 className="section-title h3">Projects</h2>
                </Reveal>
                <Row xs={1} md={2} className="g-3">
                  {project.subprojects.map((sp, i) => (
                    <Col key={sp.title}>
                      <Reveal delay={(i % 2) * 80} className="card sidebar-card subproject-card h-100">
                        <div className="card-body p-4">
                          <h3 className="h6 fw-bold mb-1">{sp.title}</h3>
                          <div className="small text-body-secondary mb-2">{sp.period}</div>
                          <p className="mb-3">{sp.text}</p>
                          <div className="d-flex flex-wrap gap-1">
                            {sp.tech.map((t) => (
                              <Badge key={t} bg="" className="tech-badge">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Reveal>
                    </Col>
                  ))}
                </Row>
              </section>
            )}

            <Reveal as="section" className="mb-5">
              <h2 className="section-title h3">Technical details</h2>
              <ul className="detail-list list-unstyled">
                {project.details.map((d, i) => (
                  <li key={d} style={{ transitionDelay: `${i * 60}ms` }}>
                    <i className="bi bi-check2-circle" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.figures.length > 0 && (
              <section>
                <Reveal>
                  <h2 className="section-title h3">Figures</h2>
                </Reveal>
                <Row xs={1} md={2} className="g-4">
                  {project.figures.map((f, i) => (
                    <Col key={`${f.caption}-${i}`}>
                      <Reveal delay={(i % 2) * 90}>
                        <Figure
                          src={f.src}
                          caption={f.caption}
                          hintPath={`${imgDir}fig${i + 1}.jpg`}
                          accent={category.accent}
                          ratio="4x3"
                          onOpen={() => setLightbox(f)}
                        />
                      </Reveal>
                    </Col>
                  ))}
                </Row>
              </section>
            )}
          </Col>

          <Col lg={4}>
            <aside className="project-sidebar">
              <Reveal variant="right" className="card sidebar-card mb-4">
                <div className="card-body p-4">
                  <h2 className="h6 text-uppercase fw-bold text-body-secondary mb-3">At a glance</h2>
                  <dl className="mb-0">
                    {meta.map((m) => (
                      <div key={m.label} className="meta-row">
                        <dt>
                          <i className={`bi ${m.icon} me-2`} />
                          {m.label}
                        </dt>
                        <dd>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal variant="right" delay={100} className="card sidebar-card mb-4">
                <div className="card-body p-4">
                  <h2 className="h6 text-uppercase fw-bold text-body-secondary mb-3">Tech stack</h2>
                  <div className="d-flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <Badge key={t} bg="" className="tech-badge">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>

              {project.links.length > 0 && (
                <Reveal variant="right" delay={200} className="card sidebar-card mb-4">
                  <div className="card-body p-4">
                    <h2 className="h6 text-uppercase fw-bold text-body-secondary mb-3">Links</h2>
                    <ul className="list-unstyled mb-0">
                      {project.links.map((l) => (
                        <li key={l.url} className="mb-2">
                          <a href={l.url} target="_blank" rel="noreferrer" className="explore-link">
                            <i className="bi bi-box-arrow-up-right me-1" />
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </aside>
          </Col>
        </Row>

        {siblings.length > 1 && (
          <nav className="project-pager mt-5 pt-4" aria-label="More projects in this category">
            <Row className="g-3">
              <Col xs={6}>
                <Link to={`/project/${prev.slug}`} className="pager-link">
                  <span className="small text-body-secondary">
                    <i className="bi bi-arrow-left me-1" /> Previous
                  </span>
                  <span className="fw-semibold">{prev.title}</span>
                </Link>
              </Col>
              <Col xs={6} className="text-end">
                <Link to={`/project/${next.slug}`} className="pager-link align-items-end">
                  <span className="small text-body-secondary">
                    Next <i className="bi bi-arrow-right ms-1" />
                  </span>
                  <span className="fw-semibold">{next.title}</span>
                </Link>
              </Col>
            </Row>
          </nav>
        )}
      </Container>

      <Modal show={!!lightbox?.src} onHide={() => setLightbox(null)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6">{lightbox?.caption}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {lightbox?.src && <img src={asset(lightbox.src)} alt={lightbox.caption || ''} className="w-100 d-block" />}
        </Modal.Body>
      </Modal>
    </div>
  );
}
