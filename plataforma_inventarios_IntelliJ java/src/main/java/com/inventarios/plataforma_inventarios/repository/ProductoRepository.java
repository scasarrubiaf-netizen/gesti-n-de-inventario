package com.inventarios.plataforma_inventarios.repository;

import com.inventarios.plataforma_inventarios.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Query("SELECT COALESCE(SUM(p.cantidad),0) FROM Producto p")
    int calcularStockTotal();
    long countByCantidadLessThanEqual(int stockMinimo);

    Optional<Producto> findByCodigoBarra(String codigoBarra);


}



