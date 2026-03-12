package com.proyecto.controlcar.service;

import com.proyecto.controlcar.model.Rol;
import com.proyecto.controlcar.model.Usuario;
import com.proyecto.controlcar.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> findAllClientes() {
        return usuarioRepository.findByRol(Rol.CLIENTE);
    }

    public Optional<Usuario> findById(Long id) {
        if (id == null)
            return Optional.empty();
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        if (username == null || username.isEmpty())
            return Optional.empty();
        return usuarioRepository.findByUsername(username);
    }

    public Usuario save(Usuario usuario) {
        if (usuario == null)
            throw new IllegalArgumentException("El usuario no puede ser nulo");
        if (usuario.getId() == null) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    public void deleteById(Long id) {
        if (id != null) {
            usuarioRepository.deleteById(id);
        }
    }
}
