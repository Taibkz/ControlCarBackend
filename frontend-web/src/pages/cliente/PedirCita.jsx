import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { CalendarPlus, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';

const PedirCita = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedVehiculo, setSelectedVehiculo] = useState('');
  const [selectedServicio, setSelectedServicio] = useState('');
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [cargandoHoras, setCargandoHoras] = useState(false);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculosRes, serviciosRes] = await Promise.all([
          api.get('/cliente/vehiculos'),
          api.get('/cliente/servicios')
        ]);
        setVehiculos(vehiculosRes.data);
        setServicios(serviciosRes.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del formulario.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setHoraSeleccionada('');
    setHorasDisponibles([]);
    
    if (fechaSeleccionada) {
      const fetchHoras = async () => {
        setCargandoHoras(true);
        try {
          const res = await api.get(`/cliente/citas/disponibilidad?fecha=${fechaSeleccionada}`);
          setHorasDisponibles(res.data);
        } catch (err) {
          console.error("Error obteniendo horas:", err);
          setError("No se pudieron cargar las horas disponibles para ese día.");
        } finally {
          setCargandoHoras(false);
        }
      };
      fetchHoras();
    }
  }, [fechaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedVehiculo || !selectedServicio || !fechaSeleccionada || !horaSeleccionada) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const formParams = new URLSearchParams();
      formParams.append('vehiculoId', selectedVehiculo);
      formParams.append('servicioId', selectedServicio);
      const fechaHoraISO = `${fechaSeleccionada}T${horaSeleccionada}:00`;
      formParams.append('fechaHora', fechaHoraISO);

      await api.post('/cliente/citas', formParams);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/cliente/panel');
      }, 2500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Ocurrió un error al agendar la cita.");
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando formulario...</div>;

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
          <CheckCircle2 size={44} color="#6ee7b7" />
        </div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>¡Cita Solicitada con Éxito!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirigiendo a tu panel...</p>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <PageHeader
        icon={<CalendarPlus size={26} color="var(--primary)" />}
        title="Agendar Nueva Cita"
        subtitle="Selecciona tu vehículo, el servicio que necesitas y la fecha deseada."
      />

      <div className="card">
        {error && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 500, border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group">
            <label className="form-label">Vehículo</label>
            {vehiculos.length === 0 ? (
              <p style={{ color: 'var(--warning)', fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(245,158,11,0.08)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)', margin: 0 }}>
                ⚠️ Debes registrar un vehículo en tu garaje antes de pedir una cita.
              </p>
            ) : (
              <select className="form-select" value={selectedVehiculo} onChange={(e) => setSelectedVehiculo(e.target.value)}>
                <option value="">-- Selecciona un Vehículo --</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.matricula})</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Servicio</label>
            <select className="form-select" value={selectedServicio} onChange={(e) => setSelectedServicio(e.target.value)}>
              <option value="">-- Selecciona el Servicio --</option>
              {servicios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — {s.precioBase || s.precio}€ · {s.duracionMinutos ? `${s.duracionMinutos} min` : 'Duración variable'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Visita</label>
            <input 
              type="date" 
              className="form-input" 
              value={fechaSeleccionada} 
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              min={minDate} 
            />
          </div>

          {fechaSeleccionada && (
            <div className="form-group">
              <label className="form-label">Hora Disponible</label>
              {cargandoHoras ? (
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Buscando huecos libres...</p>
              ) : horasDisponibles.length > 0 ? (
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {horasDisponibles.map(hora => (
                       <button
                         key={hora}
                         type="button"
                         onClick={() => setHoraSeleccionada(hora)}
                         style={{
                            padding: '0.5rem 1rem',
                            border: `2px solid ${horaSeleccionada === hora ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '10px',
                            background: horaSeleccionada === hora ? 'rgba(225,29,72,0.12)' : 'var(--bg-main)',
                            color: horaSeleccionada === hora ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: horaSeleccionada === hora ? 700 : 400,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            boxShadow: horaSeleccionada === hora ? 'var(--shadow-glow-red)' : 'none'
                         }}
                       >
                         <Clock size={15} /> {hora}
                       </button>
                    ))}
                 </div>
              ) : (
                 <p style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', margin: 0 }}>
                    No hay horas disponibles para este día (Completo o Cerrado).
                 </p>
              )}
            </div>
          )}

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }} disabled={vehiculos.length === 0 || !horaSeleccionada}>
                Confirmar Cita
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PedirCita;
