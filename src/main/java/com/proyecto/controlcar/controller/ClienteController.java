package com.proyecto.controlcar.controller;

import com.proyecto.controlcar.dto.*;
import com.proyecto.controlcar.model.*;
import com.proyecto.controlcar.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    private final UsuarioService usuarioService;
    private final VehiculoService vehiculoService;
    private final CitaService citaService;
    private final TipoServicioService tipoServicioService;

    public ClienteController(UsuarioService usuarioService, VehiculoService vehiculoService, CitaService citaService,
            TipoServicioService tipoServicioService) {
        this.usuarioService = usuarioService;
        this.vehiculoService = vehiculoService;
        this.citaService = citaService;
        this.tipoServicioService = tipoServicioService;
    }

    private Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return usuarioService.findByUsername(auth.getName()).orElse(null);
    }

    @GetMapping("/citas")
    public ResponseEntity<List<CitaDTO>> getMisCitas() {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<CitaDTO> citas = citaService.findByClienteId(usuario.getId()).stream().map(this::mapCitaToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/vehiculos")
    public ResponseEntity<List<VehiculoDTO>> getMisVehiculos() {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<VehiculoDTO> vehiculos = vehiculoService.findByPropietarioId(usuario.getId())
            .stream().map(this::mapVehiculoToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(vehiculos);
    }

    @GetMapping("/servicios")
    public ResponseEntity<List<TipoServicio>> getServiciosDisponibles() {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(tipoServicioService.findAll());
    }

    @GetMapping("/citas/disponibilidad")
    public ResponseEntity<List<String>> getDisponibilidad(@RequestParam String fecha) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        try {
            java.time.LocalDate localDate = java.time.LocalDate.parse(fecha);
            List<String> horas = citaService.getHorasDisponibles(localDate);
            return ResponseEntity.ok(horas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/vehiculos")
    public ResponseEntity<?> guardarVehiculo(@RequestBody Vehiculo vehiculo) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            vehiculo.setPropietario(usuario);
            Vehiculo guardado = vehiculoService.save(vehiculo);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapVehiculoToDTO(guardado));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Esta matrícula ya está registrada en el sistema.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar el vehículo.");
        }
    }

    @PostMapping("/citas")
    public ResponseEntity<?> guardarCita(@RequestParam Long vehiculoId,
                                         @RequestParam Long servicioId,
                                         @RequestParam String fechaHora) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            Cita cita = new Cita();
            cita.setCliente(usuario);

            Vehiculo vehiculo = vehiculoService.findById(vehiculoId)
                    .orElseThrow(() -> new IllegalArgumentException("Vehículo inválido"));
            cita.setVehiculo(vehiculo);

            TipoServicio servicio = tipoServicioService.findById(servicioId)
                    .orElseThrow(() -> new IllegalArgumentException("Servicio inválido"));
            cita.setServicio(servicio);

            cita.setFechaHora(LocalDateTime.parse(fechaHora));
            cita.setEstado(EstadoCita.PENDIENTE);
            Cita guardada = citaService.save(cita);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapCitaToDTO(guardada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/citas/{id}/cancelar")
    public ResponseEntity<?> cancelarCita(@PathVariable Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Cita cita = citaService.findById(id).orElse(null);

        if (usuario != null && cita != null && cita.getCliente() != null && cita.getCliente().getId().equals(usuario.getId())) {
            cita.setEstado(EstadoCita.CANCELADA);
            Cita actualizada = citaService.save(cita);
            return ResponseEntity.ok(mapCitaToDTO(actualizada));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No se puede cancelar esta cita.");
    }

    @PutMapping("/citas/{id}/reprogramar")
    public ResponseEntity<?> reprogramarCita(@PathVariable Long id, @RequestParam String fechaHora) {
        Usuario usuario = getUsuarioAutenticado();
        Cita cita = citaService.findById(id).orElse(null);

        if (usuario != null && cita != null && cita.getCliente() != null && cita.getCliente().getId().equals(usuario.getId())) {
            try {
                cita.setFechaHora(LocalDateTime.parse(fechaHora));
                Cita actualizada = citaService.save(cita);
                return ResponseEntity.ok(mapCitaToDTO(actualizada));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No se puede reprogramar esta cita.");
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfil() {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody java.util.Map<String, String> datos) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        if (datos.containsKey("nombreCompleto")) usuario.setNombreCompleto(datos.get("nombreCompleto"));
        if (datos.containsKey("email")) usuario.setEmail(datos.get("email"));
        usuarioService.save(usuario);
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        return ResponseEntity.ok(dto);
    }

    // Mappers Manuales (Lo ideal sería MapStruct, pero para este TFG es válido y da control)
    private CitaDTO mapCitaToDTO(Cita cita) {
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setFechaHora(cita.getFechaHora());
        dto.setEstado(cita.getEstado());
        dto.setVehiculo(mapVehiculoToDTO(cita.getVehiculo()));
        
        TipoServicioDTO sDto = new TipoServicioDTO();
        sDto.setId(cita.getServicio().getId());
        sDto.setNombre(cita.getServicio().getNombre());
        dto.setServicio(sDto);
        return dto;
    }

    private VehiculoDTO mapVehiculoToDTO(Vehiculo vehiculo) {
        if(vehiculo == null) return null;
        VehiculoDTO dto = new VehiculoDTO();
        dto.setId(vehiculo.getId());
        dto.setMatricula(vehiculo.getMatricula());
        dto.setMarca(vehiculo.getMarca());
        dto.setModelo(vehiculo.getModelo());
        dto.setAnio(vehiculo.getAnio());
        
        if (vehiculo.getPropietario() != null) {
            UsuarioDTO uDto = new UsuarioDTO();
            uDto.setId(vehiculo.getPropietario().getId());
            uDto.setUsername(vehiculo.getPropietario().getUsername());
            uDto.setNombreCompleto(vehiculo.getPropietario().getNombreCompleto());
            uDto.setEmail(vehiculo.getPropietario().getEmail());
            dto.setPropietario(uDto);
        }
        
        return dto;
    }
}
