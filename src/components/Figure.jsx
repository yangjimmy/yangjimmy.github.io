import { asset } from '../utils.js';

/*
 * A project figure. With a `src` it shows the image; without one it shows a
 * placeholder telling you where to drop the file, so empty slots are obvious.
 */
export default function Figure({ src, caption, hintPath, accent, ratio = '16x9', onOpen }) {
  if (!src) {
    return (
      <figure className="project-figure mb-0">
        <div className={`ratio ratio-${ratio} figure-placeholder`} style={accent ? { '--accent': accent } : undefined}>
          <div className="d-flex flex-column align-items-center justify-content-center text-center p-3">
            <i className="bi bi-image fs-1 mb-2" />
            <span className="fw-semibold">Image coming soon</span>
            {hintPath && <code className="small mt-1 figure-hint">{hintPath}</code>}
          </div>
        </div>
        {caption && <figcaption className="figure-caption mt-2">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="project-figure mb-0">
      <button type="button" className={`ratio ratio-${ratio} figure-image-btn`} onClick={onOpen} aria-label={`Enlarge: ${caption || 'figure'}`}>
        <img src={asset(src)} alt={caption || ''} loading="lazy" className="figure-image" />
      </button>
      {caption && <figcaption className="figure-caption mt-2">{caption}</figcaption>}
    </figure>
  );
}
