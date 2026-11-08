package com.inventarios.plataforma_inventarios.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductoDTO {

    private Long id;

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    @Min(0)
    private Double precio;

    @NotNull
    @Min(0)
    private Integer cantidad;

    // getters y setters
}

