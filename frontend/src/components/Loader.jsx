export const Loader = ({ label = 'Loading' }) => (
  <span className="loader" aria-live="polite">
    <span className="loader-dot" />
    {label}
  </span>
);
