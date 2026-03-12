package com.proyecto.controlcar.service;

import com.proyecto.controlcar.model.Vehiculo;
import com.proyecto.controlcar.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Vehiculo> findAll() {
        return vehiculoRepository.findAll();
    }

    public List<Vehiculo> findByPropietarioId(Long propietarioId) {
        if (propietarioId == null)
            return List.of();
        return vehiculoRepository.findByPropietarioId(propietarioId);
    }

    public Optional<Vehiculo> findById(Long id) {
        if (id == null)
            return Optional.empty();
        return vehiculoRepository.findById(id);
    }

    public Vehiculo save(Vehiculo vehiculo) {
        if (vehiculo == null)
            throw new IllegalArgumentException("El vehiculo no puede ser nulo");
        return vehiculoRepository.save(vehiculo);
    }

    public void deleteById(Long id) {
        if (id != null) {
            vehiculoRepository.deleteById(id);
        }
    }
}
