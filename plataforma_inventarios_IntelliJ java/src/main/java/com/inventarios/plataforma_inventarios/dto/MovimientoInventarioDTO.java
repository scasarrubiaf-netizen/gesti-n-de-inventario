package com.inventarios.plataforma_inventarios.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MovimientoInventarioDTO {

    @NotNull
    private Long productoId;

    @NotBlank
    private String tipo; // ENTRADA o SALIDA

    @NotNull
    @Min(1)
    private Integer cantidad;

    // getters y setters
}

