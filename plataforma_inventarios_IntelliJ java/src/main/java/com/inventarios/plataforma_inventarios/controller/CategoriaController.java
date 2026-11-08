package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.model.Categoria;
import com.inventarios.plataforma_inventarios.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*") // permite conexión desde el frontend
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // =========================
    // CREAR
    // =========================
    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaService.guardarCategoria(categoria);
    }

    // =========================
    // LISTAR
    // =========================
    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaService.listarCategorias();
    }

    // =========================
    // OBTENER POR ID
    // =========================
    @GetMapping("/{id}")
    public Categoria obtenerCategoria(@PathVariable Long id) {
        return categoriaService.obtenerPorId(id);
    }

    // =========================
    // ACTUALIZAR
    // =========================
    @PutMapping("/{id}")
    public Categoria actualizarCategoria(
            @PathVariable Long id,
            @RequestBody Categoria categoria) {

        return categoriaService.actualizarCategoria(id, categoria);
    }

    // =========================
    // ELIMINAR
    // =========================
    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
    }
}
