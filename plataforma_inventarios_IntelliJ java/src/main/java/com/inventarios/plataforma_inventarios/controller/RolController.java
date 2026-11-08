package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.model.Rol;
import com.inventarios.plataforma_inventarios.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PostMapping
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.guardarRol(rol);
    }

    @GetMapping
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }
}

