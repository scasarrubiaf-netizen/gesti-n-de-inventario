package com.inventarios.plataforma_inventarios.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;
    private Double pago;
    private Double cambio;
    private String empleado;
    private String metodoPago;

    private LocalDateTime fecha = LocalDateTime.now();

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles = new ArrayList<>();

    public Long getId() { return id; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public Double getPago() { return pago; }
    public void setPago(Double pago) { this.pago = pago; }
    public Double getCambio() { return cambio; }
    public void setCambio(Double cambio) { this.cambio = cambio; }
    public LocalDateTime getFecha() { return fecha; }
    public List<DetalleVenta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; }
    public String getEmpleado() { return empleado; }
    public void setEmpleado(String empleado) { this.empleado = empleado; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}