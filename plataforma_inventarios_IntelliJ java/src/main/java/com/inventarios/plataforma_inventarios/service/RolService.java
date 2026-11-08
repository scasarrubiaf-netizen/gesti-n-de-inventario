package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.model.Rol;
import com.inventarios.plataforma_inventarios.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public Rol guardarRol(Rol rol) {
        return rolRepository.save(rol);
    }

    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }
}
