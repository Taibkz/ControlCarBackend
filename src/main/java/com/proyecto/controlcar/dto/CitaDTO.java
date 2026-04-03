package com.proyecto.controlcar.dto;

import com.proyecto.controlcar.model.EstadoCita;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CitaDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private EstadoCita estado;
    private UsuarioDTO cliente;
    private VehiculoDTO vehiculo;
    private TipoServicioDTO servicio;
}
