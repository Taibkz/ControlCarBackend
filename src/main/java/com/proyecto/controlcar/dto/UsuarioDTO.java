package com.proyecto.controlcar.dto;

import com.proyecto.controlcar.model.Rol;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String username;
    private String nombreCompleto;
    private String email;
    private Rol rol;
}
