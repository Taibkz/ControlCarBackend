package com.proyecto.controlcar.service;

import com.proyecto.controlcar.model.Cita;
import com.proyecto.controlcar.repository.CitaRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    public CitaService(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    public List<Cita> findAll() {
        return citaRepository.findAll();
    }

    public List<Cita> findByClienteId(Long clienteId) {
        if (clienteId == null)
            return List.of();
        return citaRepository.findByClienteId(clienteId);
    }

    public Optional<Cita> findById(Long id) {
        if (id == null)
            return Optional.empty();
        return citaRepository.findById(id);
    }

    public Cita save(Cita cita) {
        if (cita == null)
            throw new IllegalArgumentException("La cita no puede ser nula");
        validateCita(cita);
        return citaRepository.save(cita);
    }

    public void deleteById(Long id) {
        if (id != null) {
            citaRepository.deleteById(id);
        }
    }

    private void validateCita(Cita cita) {
        // Permitir cancelar sin validar horario
        if (cita.getEstado() == com.proyecto.controlcar.model.EstadoCita.CANCELADA) {
            return;
        }

        if (cita.getFechaHora() == null) {
            throw new IllegalArgumentException("La fecha y hora de la cita son obligatorias.");
        }

        // Obtener la duración del servicio (minutos)
        int duracion = 60; // Default
        if (cita.getServicio() != null && cita.getServicio().getDuracionMinutos() != null) {
            duracion = cita.getServicio().getDuracionMinutos();
        }

        LocalDateTime inicio = cita.getFechaHora();
        LocalDateTime fin = inicio.plusMinutes(duracion);

        // 1. Validar Horario de Apertura
        if (!isWithinOpeningHours(inicio, fin)) {
            throw new IllegalArgumentException("La cita está fuera del horario de atención.");
        }

        // 2. Validar Colisiones (Capacidad)
        // Definir rango del día completo para buscar citas
        LocalDateTime inicioDia = inicio.toLocalDate().atStartOfDay();
        LocalDateTime finDia = inicio.toLocalDate().atTime(LocalTime.MAX);

        List<Cita> citasDelDia = citaRepository.findByFechaHoraBetween(inicioDia, finDia);

        int colisiones = 0;
        final int MAX_SIMULTANEOUS_APPOINTMENTS = 1;

        for (Cita existente : citasDelDia) {
            // Ignorar la misma cita si se está editando (mismo ID)
            if (existente.getId() != null && existente.getId().equals(cita.getId())) {
                continue;
            }

            // Ignorar citas canceladas para el cálculo de disponibilidad
            if (existente.getEstado() == com.proyecto.controlcar.model.EstadoCita.CANCELADA) {
                continue;
            }

            // Calcular fin de la cita existente
            int duracionExistente = 60;
            if (existente.getServicio() != null && existente.getServicio().getDuracionMinutos() != null) {
                duracionExistente = existente.getServicio().getDuracionMinutos();
            }
            LocalDateTime inicioExistente = existente.getFechaHora();
            LocalDateTime finExistente = inicioExistente.plusMinutes(duracionExistente);

            // Verificar solapamiento: (StartA < EndB) and (EndA > StartB)
            if (inicio.isBefore(finExistente) && fin.isAfter(inicioExistente)) {
                colisiones++;
            }
        }

        if (colisiones >= MAX_SIMULTANEOUS_APPOINTMENTS) {
            throw new IllegalArgumentException("No hay disponibilidad para el horario seleccionado.");
        }
    }

    private boolean isWithinOpeningHours(LocalDateTime inicio, LocalDateTime fin) {
        DayOfWeek dia = inicio.getDayOfWeek();
        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        // DOMINGO CERRADO
        if (dia == DayOfWeek.SUNDAY) {
            return false;
        }

        // LUNES - JUEVES
        if (dia != DayOfWeek.FRIDAY && dia != DayOfWeek.SATURDAY) {
            // Mañana: 09:00 - 14:00 (14:00 es la última hora de reserva posible, termina a las 15:00 como tarde o según servicio, pero ajustamos a la disponibilidad dada)
            // Permitimos inicio 09:00 - 13:00, fin max 15:00 para encajar el turno
            boolean manana = !horaInicio.isBefore(LocalTime.of(9, 0)) &&
                    !horaFin.isAfter(LocalTime.of(15, 0));

            // Tarde: 16:00 - 20:00 (última 19:00)
            boolean tarde = !horaInicio.isBefore(LocalTime.of(16, 0)) &&
                    !horaFin.isAfter(LocalTime.of(21, 0)); // Para permitir una cita de 1 hora o más empezando a las 19:00

            return manana || tarde;
        }

        // VIERNES - SABADO: 11:00 - 15:00 (última reserva a las 14:00)
        if (dia == DayOfWeek.FRIDAY || dia == DayOfWeek.SATURDAY) {
            return !horaInicio.isBefore(LocalTime.of(11, 0)) &&
                    !horaFin.isAfter(LocalTime.of(16, 0)); // Para permitir que la cita de las 14:00 encaje si dura una hora o poco más
        }

        return false;
    }

    public List<String> getHorasDisponibles(java.time.LocalDate fecha) {
        if (fecha == null) return java.util.Collections.emptyList();
        
        List<String> horasPosibles = new java.util.ArrayList<>();
        DayOfWeek dia = fecha.getDayOfWeek();

        // Generar horas de 1 en 1 hora según horario
        if (dia != DayOfWeek.SUNDAY) {
            if (dia != DayOfWeek.FRIDAY && dia != DayOfWeek.SATURDAY) {
                // Lunes a Jueves
                horasPosibles.add("09:00");
                horasPosibles.add("10:00");
                horasPosibles.add("11:00");
                horasPosibles.add("12:00");
                horasPosibles.add("13:00");
                horasPosibles.add("16:00");
                horasPosibles.add("17:00");
                horasPosibles.add("18:00");
                horasPosibles.add("19:00");
            } else {
                // Viernes y Sábado
                horasPosibles.add("11:00");
                horasPosibles.add("12:00");
                horasPosibles.add("13:00");
                horasPosibles.add("14:00");
            }
        }

        // Obtener citas existentes en esa fecha
        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.atTime(LocalTime.MAX);
        List<Cita> citasDelDia = citaRepository.findByFechaHoraBetween(inicioDia, finDia);

        // Filtrar horas ocupadas
        List<String> horasDisponibles = new java.util.ArrayList<>();
        for (String horaStr : horasPosibles) {
            LocalTime hora = LocalTime.parse(horaStr);
            LocalDateTime inicioTramo = fecha.atTime(hora);
            LocalDateTime finTramo = inicioTramo.plusMinutes(60); // Asumimos reservas modulares de 60m para simplificar visualización

            boolean ocupado = false;
            for (Cita existente : citasDelDia) {
                if (existente.getEstado() == com.proyecto.controlcar.model.EstadoCita.CANCELADA) continue;
                
                int duracionExistente = existente.getServicio() != null && existente.getServicio().getDuracionMinutos() != null 
                    ? existente.getServicio().getDuracionMinutos() 
                    : 60;
                
                LocalDateTime inicioExistente = existente.getFechaHora();
                LocalDateTime finExistente = inicioExistente.plusMinutes(duracionExistente);

                // Solapamiento: (StartA < EndB) and (EndA > StartB)
                if (inicioTramo.isBefore(finExistente) && finTramo.isAfter(inicioExistente)) {
                    ocupado = true;
                    break;
                }
            }

            // Además, filtrar horas que ya pasaron si es el día de hoy
            if (!ocupado) {
                if (fecha.isEqual(java.time.LocalDate.now()) && hora.isBefore(LocalTime.now())) {
                    // Ya pasó la hora hoy
                } else {
                    horasDisponibles.add(horaStr);
                }
            }
        }

        return horasDisponibles;
    }
}
