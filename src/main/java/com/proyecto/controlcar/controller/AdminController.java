package com.proyecto.controlcar.controller;

import com.proyecto.controlcar.dto.*;
import com.proyecto.controlcar.model.*;
import com.proyecto.controlcar.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioService usuarioService;
    private final VehiculoService vehiculoService;
    private final CitaService citaService;
    private final TipoServicioService tipoServicioService;

    public AdminController(UsuarioService usuarioService, VehiculoService vehiculoService, CitaService citaService,
            TipoServicioService tipoServicioService) {
        this.usuarioService = usuarioService;
        this.vehiculoService = vehiculoService;
        this.citaService = citaService;
        this.tipoServicioService = tipoServicioService;
    }

    @GetMapping("/panel")
    public ResponseEntity<Map<String, Object>> getPanelData() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalCitas", citaService.findAll().size());
        data.put("totalClientes", usuarioService.findAllClientes().size());
        
        List<CitaDTO> citas = citaService.findAll().stream().map(this::mapCitaToDTO).collect(Collectors.toList());
        data.put("citas", citas);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<UsuarioDTO>> getClientes() {
        List<UsuarioDTO> clientes = usuarioService.findAllClientes().stream().map(u -> {
            UsuarioDTO dto = new UsuarioDTO();
            dto.setId(u.getId());
            dto.setUsername(u.getUsername());
            dto.setNombreCompleto(u.getNombreCompleto());
            dto.setEmail(u.getEmail());
            dto.setRol(u.getRol());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }

    @PostMapping("/clientes")
    public ResponseEntity<UsuarioDTO> guardarCliente(@RequestBody Usuario cliente) {
        cliente.setRol(Rol.CLIENTE);
        Usuario guardado = usuarioService.save(cliente);
        
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(guardado.getId());
        dto.setUsername(guardado.getUsername());
        dto.setNombreCompleto(guardado.getNombreCompleto());
        dto.setEmail(guardado.getEmail());
        dto.setRol(guardado.getRol());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vehiculos")
    public ResponseEntity<List<VehiculoDTO>> getVehiculos() {
        List<VehiculoDTO> vehiculos = vehiculoService.findAll().stream().map(this::mapVehiculoToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(vehiculos);
    }

    @PostMapping("/vehiculos")
    public ResponseEntity<VehiculoDTO> guardarVehiculo(@RequestBody Vehiculo vehiculo) {
        if(vehiculo.getPropietario() != null && vehiculo.getPropietario().getId() != null) {
            Usuario prop = usuarioService.findById(vehiculo.getPropietario().getId()).orElse(null);
            vehiculo.setPropietario(prop);
        }
        Vehiculo guardado = vehiculoService.save(vehiculo);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapVehiculoToDTO(guardado));
    }

    @DeleteMapping("/vehiculos/{id}")
    public ResponseEntity<?> eliminarVehiculo(@PathVariable Long id) {
        vehiculoService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/servicios")
    public ResponseEntity<List<TipoServicio>> getServicios() {
        return ResponseEntity.ok(tipoServicioService.findAll());
    }

    @GetMapping("/citas/disponibilidad")
    public ResponseEntity<List<String>> getDisponibilidad(@RequestParam String fecha) {
        try {
            java.time.LocalDate localDate = java.time.LocalDate.parse(fecha);
            List<String> horas = citaService.getHorasDisponibles(localDate);
            return ResponseEntity.ok(horas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/servicios")
    public ResponseEntity<TipoServicio> guardarServicio(@RequestBody TipoServicio servicio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoServicioService.save(servicio));
    }

    @PutMapping("/servicios/{id}")
    public ResponseEntity<?> editarServicio(@PathVariable Long id, @RequestBody TipoServicio servicio) {
        TipoServicio existente = tipoServicioService.findById(id).orElse(null);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(servicio.getNombre());
        existente.setDescripcion(servicio.getDescripcion());
        existente.setPrecio(servicio.getPrecio());
        existente.setDuracionMinutos(servicio.getDuracionMinutos());
        return ResponseEntity.ok(tipoServicioService.save(existente));
    }

    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<?> eliminarServicio(@PathVariable Long id) {
        tipoServicioService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/citas")
    public ResponseEntity<List<CitaDTO>> getCitas() {
        List<CitaDTO> citas = citaService.findAll().stream().map(this::mapCitaToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @PutMapping("/citas/{id}/estado")
    public ResponseEntity<?> actualizarEstadoCita(@PathVariable Long id, @RequestParam EstadoCita estado) {
        Cita existente = citaService.findById(id).orElse(null);
        if (existente != null) {
            try {
                existente.setEstado(estado);
                Cita actualizada = citaService.save(existente);
                return ResponseEntity.ok(mapCitaToDTO(actualizada));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/citas/{id}")
    public ResponseEntity<?> eliminarCita(@PathVariable Long id) {
        citaService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Mappers Manuales
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
        
        if (cita.getCliente() != null) {
            UsuarioDTO uDto = new UsuarioDTO();
            uDto.setId(cita.getCliente().getId());
            uDto.setUsername(cita.getCliente().getUsername());
            uDto.setNombreCompleto(cita.getCliente().getNombreCompleto());
            uDto.setEmail(cita.getCliente().getEmail());
            dto.setCliente(uDto);
        }
        
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
