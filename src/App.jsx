import { Routes, Route, useLocation } from 'react-router-dom';

import SiteNavbar from './components/SiteNavbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Home from './pages/Home.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import AllProjects from './pages/AllProjects.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <SiteNavbar />
      {/* Keying on the path replays the page-enter animation on every route change. */}
      <main key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
