package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.model.Rol;
import com.inventarios.plataforma_inventarios.model.Usuario;
import com.inventarios.plataforma_inventarios.repository.RolRepository;
import com.inventarios.plataforma_inventarios.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===== CREAR EMPLEADO =====
    public Usuario crearUsuario(Usuario usuario) {
        Rol rol = rolRepository.findByNombre("EMPLEADO")
                .orElseThrow(() -> new RuntimeException("Rol EMPLEADO no encontrado"));
        usuario.setRol(rol);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    // ===== LISTAR =====
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ===== CAMBIAR CONTRASEÑA =====
    public void cambiarPassword(String username, String passwordActual, String passwordNueva) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }

    // ===== EDITAR EMPLEADO =====
    public Usuario editarUsuario(Long id, String nuevoUsername) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setUsername(nuevoUsername);
        return usuarioRepository.save(usuario);
    }

    // ===== ACTIVAR / DESACTIVAR =====
    public Usuario toggleActivo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        return usuarioRepository.save(usuario);
    }
}