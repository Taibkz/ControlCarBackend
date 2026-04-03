import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { User, Save, Mail, AtSign } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useToast } from '../../components/Toast/Toast';
import Skeleton from '../../components/Skeleton/Skeleton';

const MiPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ nombreCompleto: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/cliente/perfil')
      .then(res => {
        setPerfil(res.data);
        setForm({ nombreCompleto: res.data.nombreCompleto, email: res.data.email });
      })
      .catch(() => toast('Error cargando perfil', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/cliente/perfil', form);
      setPerfil(res.data);
      toast('Perfil actualizado correctamente', 'success');
    } catch {
      toast('Error al actualizar el perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <PageHeader
        icon={<User size={26} color="var(--primary)" />}
        title="Mi Perfil"
        subtitle="Actualiza tu información personal."
      />

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <Skeleton width="72px" height="72px" borderRadius="50%" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton height="1.2rem" width="50%" />
                <Skeleton height="0.85rem" width="35%" />
              </div>
            </div>
            <Skeleton height="2.75rem" />
            <Skeleton height="2.75rem" />
          </div>
        ) : (
          <>
            {/* Avatar + info no editable */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: 900, color: '#000',
                boxShadow: 'var(--shadow-glow-red)', flexShrink: 0
              }}>
                {perfil?.nombreCompleto?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.15rem' }}>{perfil?.nombreCompleto}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <AtSign size={13} /> {perfil?.username}
                </div>
                <span style={{ marginTop: '0.3rem', display: 'inline-block', background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.25)', color: 'var(--primary)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  CLIENTE
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    required
                    type="text"
                    className="form-input"
                    value={form.nombreCompleto}
                    onChange={e => setForm({...form, nombreCompleto: e.target.value})}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    required
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={17} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;
