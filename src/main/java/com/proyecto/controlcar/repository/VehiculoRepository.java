package com.proyecto.controlcar.repository;

import com.proyecto.controlcar.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    List<Vehiculo> findByPropietarioId(Long propietarioId);

    Optional<Vehiculo> findByMatricula(String matricula);
}
