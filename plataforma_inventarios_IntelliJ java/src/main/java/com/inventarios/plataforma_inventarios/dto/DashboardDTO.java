package com.inventarios.plataforma_inventarios.dto;

import java.util.List;

public class DashboardDTO {

    private long totalProductos;
    private long totalCategorias;
    private long totalMovimientos;
    private int stockTotal;
    private List<ProductoStockBajoDTO> productosStockBajo;

    public DashboardDTO(long totalProductos, long totalCategorias, long totalMovimientos,
                        int stockTotal, List<ProductoStockBajoDTO> productosStockBajo) {
        this.totalProductos = totalProductos;
        this.totalCategorias = totalCategorias;
        this.totalMovimientos = totalMovimientos;
        this.stockTotal = stockTotal;
        this.productosStockBajo = productosStockBajo;
    }

    public long getTotalProductos() {
        return totalProductos;
    }

    public long getTotalCategorias() {
        return totalCategorias;
    }

    public long getTotalMovimientos() {
        return totalMovimientos;
    }

    public int getStockTotal() {
        return stockTotal;
    }

    public List<ProductoStockBajoDTO> getProductosStockBajo() {
        return productosStockBajo;
    }
}

