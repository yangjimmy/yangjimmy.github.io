import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useInView.js';

// Types each word, pauses, deletes it, then moves to the next.
export default function Typewriter({ words, typeMs = 70, deleteMs = 35, holdMs = 1600 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(prefersReducedMotion() ? words[0] : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const word = words[index % words.length];
    let timeout;
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typeMs, deleteMs, holdMs]);

  return (
    <span className="typewriter">
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
