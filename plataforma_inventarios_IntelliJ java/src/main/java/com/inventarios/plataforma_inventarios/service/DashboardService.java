package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.repository.CategoriaRepository;
import com.inventarios.plataforma_inventarios.repository.MovimientoRepository;
import com.inventarios.plataforma_inventarios.repository.ProductoRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimientoRepository movimientoRepository;

    public DashboardService(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            MovimientoRepository movimientoRepository) {

        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.movimientoRepository = movimientoRepository;
    }

    // =========================
    // TOTAL DE PRODUCTOS
    // =========================
    public long totalProductos() {
        return productoRepository.count();
    }

    // =========================
    // TOTAL DE CATEGORÍAS
    // =========================
    public long totalCategorias() {
        return categoriaRepository.count();
    }

    // =========================
    // TOTAL DE MOVIMIENTOS
    // =========================
    public long totalMovimientos() {
        return movimientoRepository.count();
    }

    // =========================
    // STOCK TOTAL (SUMA DE PRODUCTOS)
    // =========================
    public int stockTotal() {
        return productoRepository.calcularStockTotal();
    }
}



