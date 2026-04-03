import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_ES = ['L','M','X','J','V','S','D'];

const ESTADO_COLORS = {
  PENDIENTE:  '#fcd34d',
  CONFIRMADA: '#93c5fd',
  EN_CURSO:   '#d8b4fe',
  FINALIZADA: '#6ee7b7',
  CANCELADA:  '#fca5a5',
};

const CalendarioCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoy] = useState(new Date());
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    api.get('/admin/citas')
      .then(res => setCitas(res.data))
      .finally(() => setLoading(false));
  }, []);

  const irMesAnterior = () => {
    if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1); }
    else setMesActual(m => m - 1);
    setDiaSeleccionado(null);
  };

  const irMesSiguiente = () => {
    if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1); }
    else setMesActual(m => m + 1);
    setDiaSeleccionado(null);
  };

  // Build calendar grid
  const primerDia = new Date(anioActual, mesActual, 1);
  const ultimoDia = new Date(anioActual, mesActual + 1, 0);
  // Mon = 0, ..., Sun = 6
  const offsetInicio = (primerDia.getDay() + 6) % 7;
  const diasEnMes = ultimoDia.getDate();
  const celdas = offsetInicio + diasEnMes;
  const totalCeldas = Math.ceil(celdas / 7) * 7;

  // Map citas por día dd-mm-yyyy
  const citasPorDia = {};
  citas.forEach(c => {
    const d = new Date(c.fechaHora);
    if (d.getMonth() === mesActual && d.getFullYear() === anioActual) {
      const key = d.getDate();
      if (!citasPorDia[key]) citasPorDia[key] = [];
      citasPorDia[key].push(c);
    }
  });

  const citasDelDia = diaSeleccionado ? (citasPorDia[diaSeleccionado] || []) : [];

  return (
    <div>
      <PageHeader
        icon={<CalendarDays size={26} color="var(--primary)" />}
        title="Calendario de Citas"
        subtitle="Vista mensual de todas las reservas del taller."
      />

      <div style={{ display: 'grid', gridTemplateColumns: diaSeleccionado ? '1fr 340px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Calendario */}
        <div className="card" style={{ padding: '1.25rem' }}>
          {/* Cabecera mes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <button onClick={irMesAnterior} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {MONTHS_ES[mesActual]} {anioActual}
            </h2>
            <button onClick={irMesSiguiente} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Días de la semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
            {DAYS_ES.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
            ))}
          </div>

          {/* Celdas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
            {Array.from({ length: totalCeldas }).map((_, idx) => {
              const diaNum = idx - offsetInicio + 1;
              const esDiaValido = diaNum >= 1 && diaNum <= diasEnMes;
              const esHoy = esDiaValido && diaNum === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();
              const esSeleccionado = diaSeleccionado === diaNum;
              const citas = esDiaValido ? (citasPorDia[diaNum] || []) : [];

              return (
                <div
                  key={idx}
                  onClick={() => esDiaValido && setDiaSeleccionado(esSeleccionado ? null : diaNum)}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '0.3rem',
                    borderRadius: '8px',
                    cursor: esDiaValido ? 'pointer' : 'default',
                    background: esSeleccionado ? 'rgba(225,29,72,0.15)' : esHoy ? 'rgba(234,179,8,0.1)' : 'transparent',
                    border: esSeleccionado ? '1px solid var(--primary)' : esHoy ? '1px solid rgba(234,179,8,0.4)' : '1px solid transparent',
                    transition: 'all 0.15s',
                    opacity: esDiaValido ? 1 : 0,
                  }}
                >
                  {esDiaValido && (
                    <>
                      <span style={{ fontSize: '0.85rem', fontWeight: esHoy ? 800 : 500, color: esHoy ? 'var(--secondary)' : esSeleccionado ? 'var(--primary)' : 'var(--text-main)', lineHeight: 1.2 }}>
                        {diaNum}
                      </span>
                      {citas.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '3px', justifyContent: 'center' }}>
                          {citas.slice(0, 3).map((c, i) => (
                            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: ESTADO_COLORS[c.estado] || 'var(--primary)' }} title={c.servicio?.nombre} />
                          ))}
                          {citas.length > 3 && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{citas.length - 3}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {Object.entries(ESTADO_COLORS).map(([estado, color]) => (
              <div key={estado} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                {estado.replace('_', ' ')}
              </div>
            ))}
          </div>
        </div>

        {/* Panel lateral: citas del día seleccionado */}
        {diaSeleccionado && (
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--primary)' }}>
              Citas del {diaSeleccionado} de {MONTHS_ES[mesActual]}
            </h3>
            {citasDelDia.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sin citas este día.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {citasDelDia.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)).map(c => (
                  <div key={c.id} style={{ padding: '0.85rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', borderLeft: `3px solid ${ESTADO_COLORS[c.estado]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.85rem' }}>{new Date(c.fechaHora).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</strong>
                      <span style={{ fontSize: '0.7rem', color: ESTADO_COLORS[c.estado], fontWeight: 700 }}>{c.estado.replace('_',' ')}</span>
                    </div>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.82rem', fontWeight: 600 }}>{c.cliente?.nombreCompleto || 'Desconocido'}</p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>🔧 {c.servicio?.nombre}</p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>🚗 {c.vehiculo?.marca} {c.vehiculo?.modelo} <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>({c.vehiculo?.matricula})</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioCitas;
