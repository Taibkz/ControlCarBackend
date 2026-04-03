/**
 * PageHeader – Renders a styled page title block matching the Login aesthetic:
 *   - Gradient text title (white→red→yellow)
 *   - Muted subtitle
 *   - Decorative floating glow orbs
 *   - A colored accent separator line
 *
 * Props:
 *   icon       – Optional Lucide icon element
 *   iconColor  – Color for the icon glow wrapper (default: var(--primary))
 *   title      – Main heading text
 *   subtitle   – Optional subheading text
 *   action     – Optional JSX placed to the right (e.g. a button)
 */
const PageHeader = ({ icon, iconColor = 'var(--primary)', title, subtitle, action }) => {
  return (
    <div className="page-header" style={{ position: 'relative', marginBottom: '2rem', overflow: 'hidden' }}>

      {/* Decorative background glow orbs */}
      <div style={{
        position: 'absolute', top: '-20px', left: '-30px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '0', right: '-10px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Content row */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

          {/* Icon badge */}
          {icon && (
            <div style={{
              padding: '0.85rem',
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.07), rgba(255,255,255,0))`,
              border: `1px solid ${iconColor === 'var(--primary)' ? 'rgba(225,29,72,0.25)' : 'rgba(234,179,8,0.25)'}`,
              borderRadius: '14px',
              boxShadow: `0 0 20px ${iconColor === 'var(--primary)' ? 'rgba(225,29,72,0.2)' : 'rgba(234,179,8,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {icon}
            </div>
          )}

          <div>
            {/* Gradient title */}
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 900,
              margin: '0 0 0.3rem 0',
              background: 'linear-gradient(100deg, #ffffff 0%, #e11d48 55%, #eab308 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                margin: 0,
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                letterSpacing: '0.01em'
              }}>
                {subtitle}
              </p>
            )}

            {/* Accent separator line */}
            <div style={{
              marginTop: '0.65rem',
              height: '2px',
              width: '60px',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(225,29,72,0.5)'
            }} />
          </div>
        </div>

        {/* Optional right-side action */}
        {action && (
          <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
