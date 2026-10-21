import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getCategory } from '../data/projects.js';
import { asset } from '../utils.js';
import TiltCard from './TiltCard.jsx';

export default function ProjectCard({ project, showCategory = false }) {
  const category = getCategory(project.category);

  return (
    <TiltCard className="h-100" accent={category.accent}>
      <Link to={`/project/${project.slug}`} className="project-card card h-100 text-decoration-none">
        <div className="ratio ratio-16x9 project-card-cover">
          {project.cover ? (
            <img src={asset(project.cover)} alt="" loading="lazy" className="object-fit-cover" />
          ) : (
            <div className="cover-placeholder d-flex align-items-center justify-content-center">
              <i className={`bi ${category.icon}`} />
            </div>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-2 small">
            {showCategory && (
              <span className="category-chip">
                <i className={`bi ${category.icon} me-1`} />
                {category.title}
              </span>
            )}
            <span className="text-body-secondary">{project.period}</span>
          </div>
          <h3 className="h5 card-title mb-2">{project.title}</h3>
          <p className="card-text text-body-secondary mb-3">{project.summary}</p>
          <div className="mt-auto d-flex flex-wrap gap-1">
            {project.tech.slice(0, 4).map((t) => (
              <Badge key={t} bg="" className="tech-badge">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <span className="card-arrow" aria-hidden="true">
          <i className="bi bi-arrow-up-right" />
        </span>
      </Link>
    </TiltCard>
  );
}
