package com.proyecto.controlcar.controller;

import com.proyecto.controlcar.model.*;
import com.proyecto.controlcar.service.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/cliente")
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

    @GetMapping("/panel")
    public String panel(Model model) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            List<Cita> misCitas = citaService.findByClienteId(usuario.getId());
            model.addAttribute("citas", misCitas);
            model.addAttribute("vehiculos", usuario.getVehiculos());
        }
        return "cliente/panel";
    }

    @GetMapping("/mis-vehiculos")
    public String misVehiculos(Model model) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            model.addAttribute("vehiculos", vehiculoService.findByPropietarioId(usuario.getId()));
        }
        return "cliente/mis-vehiculos";
    }

    @GetMapping("/mis-vehiculos/nuevo")
    public String nuevoVehiculo(Model model) {
        model.addAttribute("vehiculo", new Vehiculo());
        return "cliente/form-vehiculo";
    }

    @PostMapping("/mis-vehiculos/guardar")
    public String guardarVehiculo(@ModelAttribute Vehiculo vehiculo) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            vehiculo.setPropietario(usuario);
            vehiculoService.save(vehiculo);
        }
        return "redirect:/cliente/mis-vehiculos";
    }

    @GetMapping("/pedir-cita")
    public String pedirCita(Model model) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            model.addAttribute("cita", new Cita());
            model.addAttribute("vehiculos", usuario.getVehiculos());
            model.addAttribute("servicios", tipoServicioService.findAll());
        }
        return "cliente/pedir-cita";
    }

    @PostMapping("/guardar-cita")
    public String guardarCita(@RequestParam("vehiculoId") Long vehiculoId,
            @RequestParam("servicioId") Long servicioId,
            @RequestParam("fechaHora") @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") java.time.LocalDateTime fechaHora,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            try {
                Cita cita = new Cita();
                cita.setCliente(usuario);

                Vehiculo vehiculo = vehiculoService.findById(vehiculoId)
                        .orElseThrow(() -> new IllegalArgumentException("Vehiculo invalido"));
                cita.setVehiculo(vehiculo);

                TipoServicio servicio = tipoServicioService.findById(servicioId)
                        .orElseThrow(() -> new IllegalArgumentException("Servicio invalido"));
                cita.setServicio(servicio);

                cita.setFechaHora(fechaHora);
                cita.setEstado(EstadoCita.PENDIENTE);
                citaService.save(cita);
            } catch (IllegalArgumentException e) {
                redirectAttributes.addFlashAttribute("error", e.getMessage());
                return "redirect:/cliente/pedir-cita";
            }
        }
        return "redirect:/cliente/panel";
    }

    @PostMapping("/citas/{id}/cancelar")
    public String cancelarCita(@PathVariable Long id,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        try {
            Usuario usuario = getUsuarioAutenticado();
            Cita cita = citaService.findById(id).orElse(null);

            if (usuario != null && cita != null && cita.getCliente() != null
                    && cita.getCliente().getId().equals(usuario.getId())) {
                cita.setEstado(EstadoCita.CANCELADA);
                citaService.save(cita);
                redirectAttributes.addFlashAttribute("success", "Cita cancelada correctamente.");
            } else {
                redirectAttributes.addFlashAttribute("error", "No se puede cancelar esta cita.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error al cancelar la cita: " + e.getMessage());
        }
        return "redirect:/cliente/panel";
    }

    @GetMapping("/citas/{id}/reprogramar")
    public String reprogramarCita(@PathVariable Long id, Model model) {
        Usuario usuario = getUsuarioAutenticado();
        Cita cita = citaService.findById(id).orElse(null);

        if (cita != null && cita.getCliente() != null && cita.getCliente().getId().equals(usuario.getId())) {
            model.addAttribute("cita", cita);
            model.addAttribute("servicios", tipoServicioService.findAll());
            return "cliente/reprogramar-cita";
        }
        return "redirect:/cliente/panel";
    }

    @PostMapping("/citas/{id}/reprogramar")
    public String guardarReprogramacion(@PathVariable Long id,
            @RequestParam("fechaHora") @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") java.time.LocalDateTime fechaHora,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        Usuario usuario = getUsuarioAutenticado();
        Cita cita = citaService.findById(id).orElse(null);

        if (cita != null && cita.getCliente() != null && cita.getCliente().getId().equals(usuario.getId())) {
            try {
                cita.setFechaHora(fechaHora);
                citaService.save(cita);
                redirectAttributes.addFlashAttribute("success", "Cita reprogramada correctamente.");
            } catch (IllegalArgumentException e) {
                redirectAttributes.addFlashAttribute("error", e.getMessage());
                return "redirect:/cliente/citas/" + id + "/reprogramar";
            }
        }
        return "redirect:/cliente/panel";
    }
}
