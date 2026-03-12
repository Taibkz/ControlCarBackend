package com.proyecto.controlcar.init;

import com.proyecto.controlcar.model.Rol;
import com.proyecto.controlcar.model.TipoServicio;
import com.proyecto.controlcar.model.Usuario;
import com.proyecto.controlcar.repository.TipoServicioRepository;
import com.proyecto.controlcar.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TipoServicioRepository tipoServicioRepository;
    private final PasswordEncoder passwordEncoder;

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DataInitializer(UsuarioRepository usuarioRepository, TipoServicioRepository tipoServicioRepository,
            PasswordEncoder passwordEncoder, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.usuarioRepository = usuarioRepository;
        this.tipoServicioRepository = tipoServicioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // --- EMERGENCY DB FIX ---
        // Force 'estado' column to be large enough to hold 'CANCELADA', replacing any
        // old ENUM definition.
        try {
            jdbcTemplate.execute("ALTER TABLE citas MODIFY COLUMN estado VARCHAR(50)");
            System.out.println(">>> SUCCESS: Fixed 'estado' column schema in database.");
        } catch (Exception e) {
            System.err.println(
                    ">>> WARNING: Could not apply DB schema fix (it might already be fixed): " + e.getMessage());
        }
        // ------------------------

        // Crear Admin si no existe
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombreCompleto("Administrador Principal");
            admin.setEmail("admin@controlcar.com");
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
            System.out.println(">>> Usuario ADMIN creado: admin / admin123");
        }

        // Crear Cliente de prueba si no existe
        if (usuarioRepository.findByUsername("cliente").isEmpty()) {
            Usuario cliente = new Usuario();
            cliente.setUsername("cliente");
            cliente.setPassword(passwordEncoder.encode("cliente123"));
            cliente.setNombreCompleto("Cliente de Prueba");
            cliente.setEmail("cliente@test.com");
            cliente.setRol(Rol.CLIENTE);
            usuarioRepository.save(cliente);
            System.out.println(">>> Usuario CLIENTE creado: cliente / cliente123");
        }

        // Reparar servicios existentes con duración 0 o null
        List<TipoServicio> todosLosServicios = tipoServicioRepository.findAll();
        for (TipoServicio s : todosLosServicios) {
            if (s.getDuracionMinutos() == null || s.getDuracionMinutos() == 0) {
                s.setDuracionMinutos(60); // Asignar 60 min por defecto
                tipoServicioRepository.save(s);
            }
        }

        // Crear Servicios por defecto si no hay ninguno
        if (tipoServicioRepository.count() == 0) {
            List<TipoServicio> serviciosPredefinidos = List.of(
                    new TipoServicio(null, "Cambio de Aceite", "Sustitución de aceite y filtro", 50.0, 60),
                    new TipoServicio(null, "Revisión General", "Inspección completa del vehículo", 80.0, 90),
                    new TipoServicio(null, "Cambio de Frenos", "Sustitución de pastillas y discos", 120.0, 120),
                    new TipoServicio(null, "Alineación", "Alineación y balanceo de ruedas", 40.0, 45));

            serviciosPredefinidos.forEach(tipoServicioRepository::save);
            System.out.println(">>> Servicios de prueba creados.");
        }
    }
}
