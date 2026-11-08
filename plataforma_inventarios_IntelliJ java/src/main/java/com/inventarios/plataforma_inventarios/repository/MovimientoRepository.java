package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoRepository
        extends JpaRepository<MovimientoInventario, Long> {

    // LISTAR TODOS LOS MOVIMIENTOS
    List<MovimientoInventario> findAll();

    // LISTAR MOVIMIENTOS POR PRODUCTO
    List<MovimientoInventario> findByProductoId(Long productoId);

    // CALCULAR STOCK TOTAL (ENTRADAS - SALIDAS)
    @Query("""
        SELECT COALESCE(SUM(
            CASE
                WHEN m.tipo = 'ENTRADA' THEN m.cantidad
                WHEN m.tipo = 'SALIDA' THEN -m.cantidad
                ELSE 0
            END
        ), 0)
        FROM MovimientoInventario m
    """)
    Integer calcularStockTotal();
}




