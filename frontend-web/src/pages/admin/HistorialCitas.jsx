import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { History, Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { SkeletonList } from '../../components/Skeleton/Skeleton';

const HistorialCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    api.get('/admin/citas')
      .then(res => setCitas(res.data))
      .finally(() => setLoading(false));
  }, []);

  const pasadas = citas.filter(c => ['FINALIZADA', 'CANCELADA'].includes(c.estado));

  const filtradas = pasadas.filter(c => {
    const matchEstado = filtroEstado === 'todas' || c.estado === filtroEstado;
    const termino = busqueda.toLowerCase();
    const matchBusqueda = !termino ||
      c.cliente?.nombreCompleto?.toLowerCase().includes(termino) ||
      c.vehiculo?.matricula?.toLowerCase().includes(termino) ||
      c.servicio?.nombre?.toLowerCase().includes(termino);
    return matchEstado && matchBusqueda;
  });

  const BADGE = {
    FINALIZADA: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' },
    CANCELADA:  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#fca5a5' },
  };

  return (
    <div>
      <PageHeader
        icon={<History size={26} color="var(--primary)" />}
        title="Historial de Citas"
        subtitle="Registro de todas las citas finalizadas y canceladas del taller."
      />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por cliente, matrícula o servicio..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: '2.3rem' }}
          />
        </div>
        <select className="form-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
          <option value="todas">Todos los estados</option>
          <option value="FINALIZADA">Finalizadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </div>

      {loading ? <SkeletonList rows={5} /> : filtradas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <History size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p>No se encontraron citas con los filtros actuales.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{filtradas.length} cita{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}</p>
          {filtradas.map(cita => {
            const b = BADGE[cita.estado] || BADGE.FINALIZADA;
            return (
              <div key={cita.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.1rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', flexWrap: 'wrap', transition: 'border-color 0.2s' }}>
                <div style={{ textAlign: 'center', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '0.6rem 0.85rem', borderRadius: '8px', flexShrink: 0, minWidth: '60px' }}>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{new Date(cita.fechaHora).getDate()}</span>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{new Date(cita.fechaHora).toLocaleString('es-ES', { month: 'short', year: '2-digit' })}</span>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{cita.cliente?.nombreCompleto || 'Desconocido'}</strong>
                    <span style={{ padding: '1px 8px', borderRadius: '10px', background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontSize: '0.7rem', fontWeight: 700 }}>
                      {cita.estado}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    🔧 {cita.servicio?.nombre} — 🚗 {cita.vehiculo?.marca} {cita.vehiculo?.modelo}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', marginLeft: '5px', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{cita.vehiculo?.matricula}</span>
                  </p>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistorialCitas;
