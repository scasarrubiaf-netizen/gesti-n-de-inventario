package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.model.Categoria;
import com.inventarios.plataforma_inventarios.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // =========================
    // GUARDAR
    // =========================
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // =========================
    // LISTAR
    // =========================
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // =========================
    // OBTENER POR ID
    // =========================
    public Categoria obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    // =========================
    // ACTUALIZAR
    // =========================
    public Categoria actualizarCategoria(Long id, Categoria categoria) {
        Categoria existente = obtenerPorId(id);
        existente.setNombre(categoria.getNombre());
        return categoriaRepository.save(existente);
    }

    // =========================
    // ELIMINAR
    // =========================
    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}
