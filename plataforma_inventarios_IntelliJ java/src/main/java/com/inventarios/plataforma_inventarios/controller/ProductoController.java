package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.model.Producto;
import com.inventarios.plataforma_inventarios.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
})
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // ================= CREAR =================
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    // ================= LISTAR =================
    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.listarProductos();
    }

    // ================= OBTENER POR ID =================
    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id);
    }

    // ================= ACTUALIZAR =================
    @PutMapping("/{id}")
    public Producto actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto) {

        producto.setId(id);
        return productoService.guardarProducto(producto);
    }

    // ================= ELIMINAR =================
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }

    // ================= BUSCAR POR CÓDIGO DE BARRAS (POS / ESCÁNER) =================
    @GetMapping("/codigo/{codigo}")
    public Producto buscarPorCodigo(@PathVariable String codigo) {
        return productoService.buscarPorCodigoBarra(codigo);

    }
}



