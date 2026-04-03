package com.proyecto.controlcar.dto;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String username;
    private String password;
    private String nombreCompleto;
    private String email;
}
