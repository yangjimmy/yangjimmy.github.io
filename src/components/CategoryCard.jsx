import { Link } from 'react-router-dom';

import { projectsIn } from '../data/projects.js';
import TiltCard from './TiltCard.jsx';

export default function CategoryCard({ category }) {
  const count = projectsIn(category.id).length;

  return (
    <TiltCard className="h-100" accent={category.accent} maxTilt={8}>
      <Link to={`/category/${category.id}`} className="category-card card h-100 text-decoration-none">
        <div className="card-body p-4 d-flex flex-column">
          <div className="category-icon mb-3">
            <i className={`bi ${category.icon}`} />
          </div>
          <h3 className="h5 mb-2">{category.title}</h3>
          <p className="text-body-secondary mb-4">{category.blurb}</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="small fw-semibold category-count">
              {count} project{count === 1 ? '' : 's'}
            </span>
            <span className="explore-link">
              Explore <i className="bi bi-arrow-right" />
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
