package com.proyecto.controlcar.dto;

import lombok.Data;

@Data
public class TipoServicioDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precioAproximado;
    private Integer duracionMinutos;
}
