import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position when the route changes. 'instant' overrides
// Bootstrap's smooth scroll-behavior so the new page starts at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
