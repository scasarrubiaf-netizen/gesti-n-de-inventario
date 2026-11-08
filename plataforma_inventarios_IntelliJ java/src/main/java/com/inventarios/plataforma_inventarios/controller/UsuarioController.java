package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.model.Usuario;
import com.inventarios.plataforma_inventarios.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ===== CREAR =====
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioService.crearUsuario(usuario);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Empleado registrado correctamente",
                    "username", nuevo.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== LISTAR =====
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // ===== CAMBIAR CONTRASEÑA =====
    @PutMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> body) {
        try {
            usuarioService.cambiarPassword(
                    body.get("username"),
                    body.get("passwordActual"),
                    body.get("passwordNueva")
            );
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== EDITAR USUARIO =====
    @PutMapping("/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Usuario actualizado = usuarioService.editarUsuario(id, body.get("username"));
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Usuario actualizado correctamente",
                    "username", actualizado.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== ACTIVAR / DESACTIVAR =====
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleActivo(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.toggleActivo(id);
            return ResponseEntity.ok(Map.of(
                    "mensaje", usuario.isActivo() ? "Empleado activado" : "Empleado desactivado",
                    "activo", usuario.isActivo()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}