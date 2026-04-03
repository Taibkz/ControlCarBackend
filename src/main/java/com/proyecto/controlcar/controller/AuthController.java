package com.proyecto.controlcar.controller;

import com.proyecto.controlcar.dto.AuthResponseDTO;
import com.proyecto.controlcar.dto.LoginRequestDTO;
import com.proyecto.controlcar.dto.UsuarioDTO;
import com.proyecto.controlcar.model.Usuario;
import com.proyecto.controlcar.security.JwtUtil;
import com.proyecto.controlcar.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, JwtUtil jwtUtil, 
                          UserDetailsService userDetailsService, UsuarioService usuarioService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
        
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getUsername());
        String jwt = jwtUtil.generateToken(userDetails);

        Optional<Usuario> usuarioOpt = usuarioService.findByUsername(loginRequestDTO.getUsername());
        
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Usuario usuario = usuarioOpt.get();
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());

        return ResponseEntity.ok(new AuthResponseDTO(jwt, dto));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody com.proyecto.controlcar.dto.RegistroRequestDTO registroReq) {
        
        if(usuarioService.findByUsername(registroReq.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "El nombre de usuario ya está en uso."));
        }

        // Validación extra: revisar si el email ya existe (asumiendo que usuarioService tiene o le añadimos esa lógica, por ahora solo creamos)
        // Por la limitación de la base de datos de controlcar, de momento lo guardamos directamente si el username es único.

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(registroReq.getUsername());
        nuevoUsuario.setPassword(registroReq.getPassword()); // UsuarioService ya lo encripta antes de guardar
        nuevoUsuario.setNombreCompleto(registroReq.getNombreCompleto());
        nuevoUsuario.setEmail(registroReq.getEmail());
        nuevoUsuario.setRol(com.proyecto.controlcar.model.Rol.CLIENTE); // Forzamos el rol CLIENTE

        try {
            usuarioService.save(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("message", "Usuario registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("message", "Error interno al registrar el usuario."));
        }
    }
}
