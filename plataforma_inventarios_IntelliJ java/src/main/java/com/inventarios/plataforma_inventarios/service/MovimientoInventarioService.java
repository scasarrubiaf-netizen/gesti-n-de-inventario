package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.model.MovimientoInventario;
import com.inventarios.plataforma_inventarios.model.Producto;
import com.inventarios.plataforma_inventarios.repository.MovimientoInventarioRepository;
import com.inventarios.plataforma_inventarios.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoRepo;
    private final ProductoRepository productoRepo;

    public MovimientoInventarioService(MovimientoInventarioRepository movimientoRepo,
                                       ProductoRepository productoRepo) {
        this.movimientoRepo = movimientoRepo;
        this.productoRepo = productoRepo;
    }

    // REGISTRAR MOVIMIENTO
    public MovimientoInventario registrarMovimiento(MovimientoInventario movimiento) {

        Producto producto = productoRepo.findById(
                movimiento.getProducto().getId()
        ).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if ("SALIDA".equalsIgnoreCase(movimiento.getTipo())) {
            if (producto.getCantidad() < movimiento.getCantidad()) {
                throw new RuntimeException("Stock insuficiente");
            }
            producto.setCantidad(producto.getCantidad() - movimiento.getCantidad());
        }

        if ("ENTRADA".equalsIgnoreCase(movimiento.getTipo())) {
            producto.setCantidad(producto.getCantidad() + movimiento.getCantidad());
        }

        productoRepo.save(producto);
        return movimientoRepo.save(movimiento);
    }

    // 🔹 LISTAR TODOS
    public List<MovimientoInventario> listarTodos() {
        return movimientoRepo.findAll();
    }

    // 🔹 POR PRODUCTO
    public List<MovimientoInventario> obtenerMovimientosPorProducto(Long productoId) {
        return movimientoRepo.findByProductoId(productoId);
    }
}
