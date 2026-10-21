import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { categories, getCategory, projectsIn } from '../data/projects.js';
import NotFound from './NotFound.jsx';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = getCategory(categoryId);
  if (!category) return <NotFound />;

  const items = projectsIn(category.id);

  return (
    <>
      <header className="page-header" style={{ '--accent': category.accent }}>
        <Container>
          <Breadcrumb className="mb-3">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/projects' }}>Projects</Breadcrumb.Item>
            <Breadcrumb.Item active>{category.title}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex align-items-center gap-3 mb-2 animate-in">
            <div className="category-icon category-icon-lg">
              <i className={`bi ${category.icon}`} />
            </div>
            <h1 className="display-6 fw-bold mb-0">{category.title}</h1>
          </div>
          <p className="lead text-body-secondary mb-0 animate-in" style={{ animationDelay: '120ms' }}>
            {category.blurb}
          </p>
        </Container>
      </header>

      <section className="py-5">
        <Container>
          <Row xs={1} md={2} lg={3} className="g-4">
            {items.map((p, i) => (
              <Col key={p.slug}>
                <Reveal delay={(i % 3) * 90} className="h-100">
                  <ProjectCard project={p} />
                </Reveal>
              </Col>
            ))}
          </Row>

          <Reveal className="mt-5">
            <h2 className="h6 text-uppercase text-body-secondary fw-bold mb-3">Other categories</h2>
            <div className="d-flex flex-wrap gap-2">
              {categories
                .filter((c) => c.id !== category.id)
                .map((c) => (
                  <Link key={c.id} to={`/category/${c.id}`} className="filter-pill" style={{ '--accent': c.accent }}>
                    <i className={`bi ${c.icon} me-1`} />
                    {c.title}
                  </Link>
                ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
