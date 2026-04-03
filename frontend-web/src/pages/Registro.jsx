import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { UserPlus, User, Lock, Mail, CreditCard } from 'lucide-react';

const Registro = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombreCompleto: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await api.post('/auth/registro', formData);
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrar usuario. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/logo.png"
            alt="ControlCar Logo"
            style={{ width: '90px', height: '90px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block', filter: 'drop-shadow(0 0 16px rgba(225,29,72,0.45))' }}
          />
          <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Crear Cuenta</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Únete a ControlCar para gestionar tus vehículos.</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{success}<br/>Redirigiendo al login...</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div style={{ position: 'relative' }}>
               <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="text" 
                 className="form-input" 
                 name="nombreCompleto"
                 value={formData.nombreCompleto}
                 onChange={handleChange}
                 placeholder="Ej. Juan Pérez"
                 required 
                 style={{ paddingLeft: '2.5rem' }}
               />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
               <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="email" 
                 className="form-input" 
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="tucorreo@ejemplo.com"
                 required 
                 style={{ paddingLeft: '2.5rem' }}
               />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de Usuario</label>
            <div style={{ position: 'relative' }}>
               <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="text" 
                 className="form-input" 
                 name="username"
                 value={formData.username}
                 onChange={handleChange}
                 placeholder="Elige un alias único"
                 required 
                 style={{ paddingLeft: '2.5rem' }}
               />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="password" 
                 className="form-input" 
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 placeholder="••••••••"
                 required 
                 style={{ paddingLeft: '2.5rem' }}
               />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem' }}>
            Registrarme
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>
            Inicia Sesión aquí
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Registro;
