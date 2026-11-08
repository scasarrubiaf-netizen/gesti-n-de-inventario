package com.inventarios.plataforma_inventarios.dto;

public class ProductoStockBajoDTO {

    private Long id;
    private String nombre;
    private int cantidad;

    public ProductoStockBajoDTO(Long id, String nombre, int cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public int getCantidad() {
        return cantidad;
    }
}
