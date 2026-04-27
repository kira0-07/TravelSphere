import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // If there's a hash, don't scroll to top. Let the page handle hash scrolling.
    if (hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname, hash]);

  return null;
}
