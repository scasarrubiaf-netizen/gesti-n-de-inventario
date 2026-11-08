package com.inventarios.plataforma_inventarios.dto;

import java.util.List;

public class VentaRequest {
    private Double pago;
    private Double total;
    private String empleado;
    private String metodoPago;
    private List<DetalleVentaRequest> detalles;

    public Double getPago() { return pago; }
    public void setPago(Double pago) { this.pago = pago; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getEmpleado() { return empleado; }
    public void setEmpleado(String empleado) { this.empleado = empleado; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public List<DetalleVentaRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaRequest> detalles) { this.detalles = detalles; }
}