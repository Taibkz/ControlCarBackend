package com.proyecto.controlcar.controller;

import com.proyecto.controlcar.model.*;
import com.proyecto.controlcar.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
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
    public String panel(Model model) {
        model.addAttribute("totalCitas", citaService.findAll().size());
        model.addAttribute("totalClientes", usuarioService.findAllClientes().size());
        model.addAttribute("citas", citaService.findAll());
        return "admin/panel";
    }

    @GetMapping("/clientes")
    public String clientes(Model model) {
        model.addAttribute("clientes", usuarioService.findAllClientes());
        return "admin/clientes";
    }

    @GetMapping("/clientes/nuevo")
    public String nuevoCliente(Model model) {
        Usuario cliente = new Usuario();
        cliente.setRol(Rol.CLIENTE);
        model.addAttribute("cliente", cliente);
        return "admin/form-cliente";
    }

    @PostMapping("/clientes/guardar")
    public String guardarCliente(@ModelAttribute Usuario cliente) {
        cliente.setRol(Rol.CLIENTE);
        usuarioService.save(cliente);
        return "redirect:/admin/clientes";
    }

    @GetMapping("/clientes/eliminar/{id}")
    public String eliminarCliente(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return "redirect:/admin/clientes";
    }

    @GetMapping("/vehiculos")
    public String vehiculos(Model model) {
        model.addAttribute("vehiculos", vehiculoService.findAll());
        return "admin/vehiculos";
    }

    @GetMapping("/vehiculos/nuevo")
    public String nuevoVehiculo(Model model) {
        model.addAttribute("vehiculo", new Vehiculo());
        model.addAttribute("clientes", usuarioService.findAllClientes());
        return "admin/form-vehiculo";
    }

    @PostMapping("/vehiculos/guardar")
    public String guardarVehiculo(@ModelAttribute Vehiculo vehiculo) {
        vehiculoService.save(vehiculo);
        return "redirect:/admin/vehiculos";
    }

    @GetMapping("/vehiculos/eliminar/{id}")
    public String eliminarVehiculo(@PathVariable Long id) {
        vehiculoService.deleteById(id);
        return "redirect:/admin/vehiculos";
    }

    @GetMapping("/servicios")
    public String servicios(Model model) {
        model.addAttribute("servicios", tipoServicioService.findAll());
        return "admin/servicios";
    }

    @GetMapping("/servicios/nuevo")
    public String nuevoServicio(Model model) {
        model.addAttribute("servicio", new TipoServicio());
        return "admin/form-servicio";
    }

    @PostMapping("/servicios/guardar")
    public String guardarServicio(@ModelAttribute TipoServicio servicio) {
        tipoServicioService.save(servicio);
        return "redirect:/admin/servicios";
    }

    @GetMapping("/servicios/eliminar/{id}")
    public String eliminarServicio(@PathVariable Long id) {
        tipoServicioService.deleteById(id);
        return "redirect:/admin/servicios";
    }

    @GetMapping("/citas")
    public String citas(Model model) {
        model.addAttribute("citas", citaService.findAll());
        return "admin/citas";
    }

    @GetMapping("/citas/editar/{id}")
    public String editarCita(@PathVariable Long id, Model model) {
        Cita cita = citaService.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid cita Id:" + id));
        model.addAttribute("cita", cita);
        model.addAttribute("estados", EstadoCita.values());
        return "admin/form-cita-estado";
    }

    @PostMapping("/citas/actualizar")
    public String actualizarCita(@ModelAttribute Cita cita,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        Cita existente = citaService.findById(cita.getId()).orElse(null);
        if (existente != null) {
            try {
                existente.setEstado(cita.getEstado());
                citaService.save(existente);
            } catch (IllegalArgumentException e) {
                redirectAttributes.addFlashAttribute("error", e.getMessage());
                return "redirect:/admin/citas/editar/" + cita.getId();
            }
        }
        return "redirect:/admin/citas";
    }

    @PostMapping("/citas/eliminar/{id}")
    public String eliminarCita(@PathVariable Long id,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        citaService.deleteById(id);
        redirectAttributes.addFlashAttribute("success", "Cita eliminada correctamente.");
        return "redirect:/admin/citas";
    }
}
