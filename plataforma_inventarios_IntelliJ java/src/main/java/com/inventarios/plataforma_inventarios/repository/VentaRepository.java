package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByEmpleado(String empleado);
    List<Venta> findByEmpleadoOrderByFechaDesc(String empleado);
}
