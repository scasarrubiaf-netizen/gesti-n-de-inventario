package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.model.MovimientoInventario;
import com.inventarios.plataforma_inventarios.service.MovimientoInventarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoService;

    public MovimientoInventarioController(MovimientoInventarioService movimientoService) {
        this.movimientoService = movimientoService;
    }

    // 🔹 LISTAR TODOS
    @GetMapping
    public List<MovimientoInventario> listarTodos() {
        return movimientoService.listarTodos();
    }

    // 🔹 FILTRAR POR PRODUCTO
    @GetMapping("/producto/{id}")
    public List<MovimientoInventario> movimientosPorProducto(@PathVariable Long id) {
        return movimientoService.obtenerMovimientosPorProducto(id);
    }

    // 🔹 REGISTRAR
    @PostMapping
    public MovimientoInventario registrar(@RequestBody MovimientoInventario movimiento) {
        return movimientoService.registrarMovimiento(movimiento);
    }
}
