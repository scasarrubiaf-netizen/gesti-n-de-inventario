package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.dto.DetalleVentaRequest;
import com.inventarios.plataforma_inventarios.dto.VentaRequest;
import com.inventarios.plataforma_inventarios.model.DetalleVenta;
import com.inventarios.plataforma_inventarios.model.Producto;
import com.inventarios.plataforma_inventarios.model.Venta;
import com.inventarios.plataforma_inventarios.repository.ProductoRepository;
import com.inventarios.plataforma_inventarios.repository.VentaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin
public class VentaController {

    private final VentaRepository ventaRepo;
    private final ProductoRepository productoRepo;

    public VentaController(VentaRepository ventaRepo, ProductoRepository productoRepo) {
        this.ventaRepo = ventaRepo;
        this.productoRepo = productoRepo;
    }

    @PostMapping
    public Venta registrarVenta(@RequestBody VentaRequest request) {
        Venta venta = new Venta();
        venta.setPago(request.getPago());
        venta.setEmpleado(request.getEmpleado());
        venta.setMetodoPago(request.getMetodoPago());

        List<DetalleVenta> detalles = new ArrayList<>();
        double total = 0;

        for (DetalleVentaRequest d : request.getDetalles()) {
            Producto producto = productoRepo.findById(d.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getCantidad() < d.getCantidad()) {
                throw new RuntimeException("Stock insuficiente");
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setCantidad(d.getCantidad());
            detalle.setPrecio(producto.getPrecio());

            double subtotal = producto.getPrecio() * d.getCantidad();
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);
            detalles.add(detalle);

            producto.setCantidad(producto.getCantidad() - d.getCantidad());
            productoRepo.save(producto);

            total += subtotal;
        }

        venta.setTotal(total);
        venta.setCambio(request.getPago() - total);
        venta.setDetalles(detalles);

        return ventaRepo.save(venta);
    }

    @GetMapping
    public List<Venta> listarVentas() {
        return ventaRepo.findAll();
    }

    @GetMapping("/empleado/{empleado}")
    public List<Venta> ventasPorEmpleado(@PathVariable String empleado) {
        return ventaRepo.findByEmpleadoOrderByFechaDesc(empleado);
    }
}