package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombre(String nombre);
}

