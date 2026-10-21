import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { categories } from '../data/projects.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Collapse the mobile menu after navigating.
  useEffect(() => setExpanded(false), [location.pathname]);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className={`site-navbar ${scrolled || expanded ? 'is-scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <span className="brand-mark">JY</span>
          <span className="brand-name">Jimmy Yang</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <NavDropdown title="Categories" id="categories-dropdown">
              {categories.map((c) => (
                <NavDropdown.Item as={Link} key={c.id} to={`/category/${c.id}`}>
                  <i className={`bi ${c.icon} me-2`} style={{ color: c.accent }} />
                  {c.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/projects">
              All projects
            </Nav.Link>
            <Nav.Link href="#/" onClick={(e) => scrollToAbout(e)}>
              About
            </Nav.Link>
            <ThemeToggle />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// "About" lives on the home page; scroll to it, navigating home first if needed.
function scrollToAbout(e) {
  e.preventDefault();
  const go = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  if (window.location.hash === '#/' || window.location.hash === '') {
    go();
  } else {
    window.location.hash = '#/';
    setTimeout(go, 350);
  }
}
