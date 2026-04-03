import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, User, Lock, Shield } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    }
    setIsLoading(false);
  };

  const fillDemo = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-main)',
      fontFamily: "'Outfit', sans-serif"
    }}>

      {/* ── Left Panel: Branding ── */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: 'linear-gradient(160deg, #0a0a0b 0%, #1a0505 60%, #0a0a0b 100%)',
        borderRight: '1px solid rgba(225, 29, 72, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <img
          src="/logo.png"
          alt="ControlCar Logo"
          style={{
            width: '160px',
            height: '160px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 30px rgba(225,29,72,0.35)) drop-shadow(0 0 60px rgba(234,179,8,0.15))',
            animation: 'pulseGlow 3s ease-in-out infinite',
            marginBottom: '1.25rem'
          }}
        />

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 900,
          margin: '0 0 0.3rem 0',
          background: 'linear-gradient(90deg, #fff 0%, #e11d48 50%, #eab308 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textTransform: 'uppercase',
          letterSpacing: '-1px',
          textAlign: 'center'
        }}>
          ControlCar
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 1.75rem 0'
        }}>
          Innovation in Motion
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          width: '100%',
          maxWidth: '300px'
        }}>
          {[
            { icon: '🚘', title: 'Gestión de Vehículos', desc: 'Registra y organiza tu flota' },
            { icon: '📅', title: 'Citas Online', desc: 'Reserva en segundos' },
            { icon: '🔧', title: 'Taller Inteligente', desc: 'Panel Kanban en tiempo real' }
          ].map((f) => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{f.title}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div style={{
        flex: '0 0 430px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem 3rem',
        backgroundColor: 'var(--bg-card)',
        overflowY: 'auto'
      }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(225, 29, 72, 0.1)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            borderRadius: '20px',
            padding: '3px 12px',
            fontSize: '0.72rem',
            color: 'var(--primary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem'
          }}>
            <Shield size={12} /> Acceso Seguro
          </div>
          <h2 style={{
            fontSize: '1.75rem', fontWeight: 800,
            color: 'var(--text-main)', margin: '0 0 0.4rem 0'
          }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Inicia sesión para acceder a tu panel.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{
                position: 'absolute', left: '13px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{
                position: 'absolute', left: '13px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none'
              }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ padding: '0.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
          >
            <LogIn size={18} />
            {isLoading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ¿Aún no eres cliente?{' '}
          <Link to="/registro" style={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
