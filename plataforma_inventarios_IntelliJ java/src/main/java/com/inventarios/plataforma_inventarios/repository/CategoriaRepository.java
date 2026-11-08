package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}

