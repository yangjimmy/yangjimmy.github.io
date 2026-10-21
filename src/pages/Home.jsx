import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Counter from '../components/Counter.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import Typewriter from '../components/Typewriter.jsx';
import { categories, projects } from '../data/projects.js';
import { profile } from '../data/profile.js';
import { asset } from '../utils.js';

const featured = projects.filter((p) => p.featured);

const skills = [
  { label: 'Robotics & control', items: ['ROS / ROS 2', 'Gazebo', 'FreeRTOS', 'Adaptive & optimal control', 'Reinforcement learning'] },
  { label: 'Hardware', items: ['SolidWorks', 'Fusion 360', '3-D printing', 'PCB design', 'Arduino / Raspberry Pi'] },
  { label: 'Software & ML', items: ['Python', 'C / C++', 'PyTorch', 'OpenCV', 'MATLAB / Simulink'] },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroCanvas />
        <div className="hero-glow" aria-hidden="true" />
        <Container className="hero-content">
          <p className="hero-eyebrow animate-in" style={{ animationDelay: '80ms' }}>
            {profile.headline}
          </p>
          <h1 className="hero-title animate-in" style={{ animationDelay: '180ms' }}>
            Hi, I&apos;m <span className="text-gradient">{profile.name}</span>.
          </h1>
          <p className="hero-sub animate-in" style={{ animationDelay: '300ms' }}>
            I design and build <Typewriter words={profile.roles} />
          </p>
          <div className="d-flex flex-wrap gap-3 animate-in" style={{ animationDelay: '420ms' }}>
            <Button as={Link} to="/projects" size="lg" className="btn-glow">
              View projects <i className="bi bi-arrow-right ms-1" />
            </Button>
            <Button href={profile.links.github} target="_blank" rel="noreferrer" size="lg" variant="outline-light">
              <i className="bi bi-github me-2" />
              GitHub
            </Button>
          </div>
        </Container>
        <a href="#categories" className="scroll-cue" aria-label="Scroll to categories" onClick={(e) => { e.preventDefault(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <span />
        </a>
      </section>

      <section className="stats-band py-4">
        <Container>
          <Row className="text-center g-3">
            <Col xs={6}>
              <div className="stat-value"><Counter value={projects.length} /></div>
              <div className="stat-label">Projects</div>
            </Col>
            <Col xs={6}>
              <div className="stat-value"><Counter value={categories.length} /></div>
              <div className="stat-label">Categories</div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="categories" className="py-5 section-anchor">
        <Container>
          <Reveal>
            <h2 className="section-title">Project categories</h2>
            <p className="section-lead">Pick an area to see the projects in it.</p>
          </Reveal>
          <Row xs={1} md={2} lg={3} className="g-4">
            {categories.map((c, i) => (
              <Col key={c.id}>
                <Reveal delay={i * 90} className="h-100">
                  <CategoryCard category={c} />
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Reveal className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
            <div>
              <h2 className="section-title">Featured work</h2>
              <p className="section-lead mb-0">A selection of current and recent projects.</p>
            </div>
            <Link to="/projects" className="explore-link">
              All projects <i className="bi bi-arrow-right" />
            </Link>
          </Reveal>
          <Row xs={1} md={2} lg={3} className="g-4">
            {featured.map((p, i) => (
              <Col key={p.slug}>
                <Reveal delay={(i % 3) * 90} className="h-100">
                  <ProjectCard project={p} showCategory />
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="about" className="py-5 section-anchor">
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={5}>
              <Reveal variant="left">
                <div className="about-photo ratio ratio-1x1 mb-4">
                  {profile.photo ? (
                    <img src={asset(profile.photo)} alt={profile.name} className="object-fit-cover" />
                  ) : (
                    <div className="figure-placeholder d-flex flex-column align-items-center justify-content-center">
                      <i className="bi bi-person-bounding-box fs-1 mb-2" />
                      <span className="fw-semibold">Profile photo</span>
                      <code className="small mt-1 figure-hint">public/images/profile.jpg</code>
                    </div>
                  )}
                </div>
              </Reveal>
            </Col>
            <Col lg={7}>
              <Reveal variant="right">
                <h2 className="section-title">About me</h2>
                <p className="lead">{profile.intro}</p>
                <ul className="timeline list-unstyled mt-4">
                  {profile.education.map((e) => (
                    <li key={e.degree}>
                      <div className="fw-semibold">{e.degree}</div>
                      <div className="text-body-secondary small">
                        {e.school} · {e.period}
                      </div>
                    </li>
                  ))}
                </ul>
                <Row xs={1} sm={3} className="g-3 mt-2">
                  {skills.map((s) => (
                    <Col key={s.label}>
                      <h3 className="h6 text-uppercase small fw-bold skill-label">{s.label}</h3>
                      <ul className="list-unstyled small mb-0 text-body-secondary">
                        {s.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </Col>
                  ))}
                </Row>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Button href={`mailto:${profile.links.email}`} className="btn-glow">
                    <i className="bi bi-envelope me-2" />
                    Email me
                  </Button>
                  <Button href={profile.links.linkedin} target="_blank" rel="noreferrer" variant="outline-secondary">
                    <i className="bi bi-linkedin me-2" />
                    LinkedIn
                  </Button>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
