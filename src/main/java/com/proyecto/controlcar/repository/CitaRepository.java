package com.proyecto.controlcar.repository;

import com.proyecto.controlcar.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByClienteId(Long clienteId);

    List<Cita> findByVehiculoId(Long vehiculoId);

    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
}
