package com.proyecto.controlcar.service;

import com.proyecto.controlcar.model.TipoServicio;
import com.proyecto.controlcar.repository.TipoServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoServicioService {

    private final TipoServicioRepository tipoServicioRepository;

    public TipoServicioService(TipoServicioRepository tipoServicioRepository) {
        this.tipoServicioRepository = tipoServicioRepository;
    }

    public List<TipoServicio> findAll() {
        return tipoServicioRepository.findAll();
    }

    public Optional<TipoServicio> findById(Long id) {
        if (id == null)
            return Optional.empty();
        return tipoServicioRepository.findById(id);
    }

    public TipoServicio save(TipoServicio tipoServicio) {
        if (tipoServicio == null)
            throw new IllegalArgumentException("El servicio no puede ser nulo");
        return tipoServicioRepository.save(tipoServicio);
    }

    public void deleteById(Long id) {
        if (id != null) {
            tipoServicioRepository.deleteById(id);
        }
    }
}
