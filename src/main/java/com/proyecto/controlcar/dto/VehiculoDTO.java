package com.proyecto.controlcar.dto;

import lombok.Data;

@Data
public class VehiculoDTO {
    private Long id;
    private String matricula;
    private String marca;
    private String modelo;
    private Integer anio;
    private UsuarioDTO propietario;
}
