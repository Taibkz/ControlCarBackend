export interface Usuario {
  id?: number;
  username: string;
  nombreCompleto: string;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
}

export interface Vehiculo {
  id?: number;
  matricula: string;
  marca: string;
  modelo: string;
  anio?: number;
  propietario?: Usuario;
}

export interface TipoServicio {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
}

export interface Cita {
  id?: number;
  fechaHora: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';
  cliente?: Usuario;
  vehiculo?: Vehiculo;
  servicio?: TipoServicio;
}
