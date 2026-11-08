package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}