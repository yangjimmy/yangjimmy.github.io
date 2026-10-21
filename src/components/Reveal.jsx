import useInView from '../hooks/useInView.js';

// Fades/slides its children in when scrolled into view.
// `variant` picks the motion: 'up' (default), 'left', 'right', 'zoom'.
export default function Reveal({ as: Tag = 'div', delay = 0, variant = 'up', className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
