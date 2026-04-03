/**
 * Skeleton – Placeholder shimmer block while content loads.
 * Props:
 *   width  – CSS width  (default '100%')
 *   height – CSS height (default '1rem')
 *   borderRadius – CSS border-radius (default '8px')
 *   style  – Additional inline styles
 */
const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '8px', style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, ...style }}
  />
);

export const SkeletonCard = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Skeleton height="1.2rem" width="60%" />
    <Skeleton height="0.9rem" width="40%" />
    <Skeleton height="0.9rem" />
    <Skeleton height="0.9rem" width="80%" />
  </div>
);

export const SkeletonList = ({ rows = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Skeleton width="48px" height="48px" borderRadius="50%" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton height="1rem" width="50%" />
          <Skeleton height="0.8rem" width="70%" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
