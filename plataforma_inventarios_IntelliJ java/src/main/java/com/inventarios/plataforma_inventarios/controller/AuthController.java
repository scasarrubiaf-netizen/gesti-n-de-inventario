package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.dto.LoginRequest;
import com.inventarios.plataforma_inventarios.model.Usuario;
import com.inventarios.plataforma_inventarios.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepo.findByUsername(request.getUsername())
                .orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }

        String rol = usuario.getRol().getNombre();
        return ResponseEntity.ok(Map.of(
                "username", usuario.getUsername(),
                "rol", rol
        ));
    }

    // TEMPORAL - solo para generar el hash, bórralo después
    @GetMapping("/encriptar/{pass}")
    public String encriptar(@PathVariable String pass) {
        return passwordEncoder.encode(pass);
    }
}
