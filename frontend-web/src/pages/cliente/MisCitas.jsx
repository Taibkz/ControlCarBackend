import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { CalendarClock, XCircle, Clock, CheckCircle2, Ban } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useToast } from '../../components/Toast/Toast';
import { SkeletonList } from '../../components/Skeleton/Skeleton';

const ESTADO_STYLES = {
  PENDIENTE:  { color: '#fcd34d', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: <Clock size={14}/> },
  CONFIRMADA: { color: '#93c5fd', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  icon: <CheckCircle2 size={14}/> },
  EN_CURSO:   { color: '#d8b4fe', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)',  icon: <Clock size={14}/> },
  FINALIZADA: { color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  icon: <CheckCircle2 size={14}/> },
  CANCELADA:  { color: '#fca5a5', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   icon: <Ban size={14}/> },
};

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('activas'); // 'activas' | 'historial' | 'todas'
  const toast = useToast();

  const fetchCitas = async () => {
    try {
      const res = await api.get('/cliente/citas');
      setCitas(res.data);
    } catch {
      toast('Error cargando tus citas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCitas(); }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Seguro que quieres cancelar esta cita?')) return;
    try {
      await api.put(`/cliente/citas/${id}/cancelar`);
      toast('Cita cancelada correctamente', 'info');
      fetchCitas();
    } catch {
      toast('No se pudo cancelar la cita', 'error');
    }
  };

  const ACTIVOS = ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO'];
  const HISTORIAL = ['FINALIZADA', 'CANCELADA'];

  const citasFiltradas = citas.filter(c => {
    if (filtro === 'activas')   return ACTIVOS.includes(c.estado);
    if (filtro === 'historial') return HISTORIAL.includes(c.estado);
    return true;
  });

  return (
    <div>
      <PageHeader
        icon={<CalendarClock size={26} color="var(--primary)" />}
        title="Mis Citas"
        subtitle="Consulta todas tus reservas activas y tu historial de visitas."
      />

      {/* Filtro tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'activas', label: '📅 Activas' },
          { key: 'historial', label: '📋 Historial' },
          { key: 'todas', label: '🔍 Todas' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFiltro(tab.key)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              border: `1px solid ${filtro === tab.key ? 'var(--primary)' : 'var(--border-color)'}`,
              background: filtro === tab.key ? 'rgba(225,29,72,0.12)' : 'transparent',
              color: filtro === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: filtro === tab.key ? 700 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <SkeletonList rows={3} /> : citasFiltradas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CalendarClock size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p>No hay citas en esta categoría.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {citasFiltradas.map(cita => {
            const st = ESTADO_STYLES[cita.estado] || ESTADO_STYLES.PENDIENTE;
            const esCancelable = ACTIVOS.includes(cita.estado);
            return (
              <div key={cita.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                {/* Bloque de Fecha */}
                <div style={{ textAlign: 'center', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '10px', minWidth: '68px', flexShrink: 0 }}>
                  <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                    {new Date(cita.fechaHora).getDate()}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {new Date(cita.fechaHora).toLocaleString('es-ES', { month: 'short' })}
                  </span>
                  <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{cita.servicio?.nombre}</h3>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '2px 10px', borderRadius: '12px', background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {st.icon} {cita.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    🚗 {cita.vehiculo?.marca} {cita.vehiculo?.modelo}
                    <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '4px', marginLeft: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>{cita.vehiculo?.matricula}</span>
                  </p>
                </div>

                {/* Acción cancelar */}
                {esCancelable && (
                  <button
                    onClick={() => handleCancelar(cita.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', flexShrink: 0 }}
                  >
                    <XCircle size={15} /> Cancelar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisCitas;
