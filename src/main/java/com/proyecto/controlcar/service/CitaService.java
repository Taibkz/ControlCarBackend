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
            // Mañana: 09:00 - 14:30
            boolean manana = !horaInicio.isBefore(LocalTime.of(9, 0)) &&
                    !horaFin.isAfter(LocalTime.of(14, 30));

            // Tarde: 16:00 - 20:00
            boolean tarde = !horaInicio.isBefore(LocalTime.of(16, 0)) &&
                    !horaFin.isAfter(LocalTime.of(20, 0));

            return manana || tarde;
        }

        // VIERNES - SABADO: 11:00 - 15:00
        if (dia == DayOfWeek.FRIDAY || dia == DayOfWeek.SATURDAY) {
            return !horaInicio.isBefore(LocalTime.of(11, 0)) &&
                    !horaFin.isAfter(LocalTime.of(15, 0));
        }

        return false;
    }
}
