package com.inventarios.plataforma_inventarios.service;

import com.inventarios.plataforma_inventarios.model.MovimientoInventario;
import com.inventarios.plataforma_inventarios.model.Producto;
import com.inventarios.plataforma_inventarios.repository.MovimientoInventarioRepository;
import com.inventarios.plataforma_inventarios.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public ProductoService(ProductoRepository productoRepository,
                           MovimientoInventarioRepository movimientoRepository) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    // =========================
    // CREAR
    // =========================
    public Producto guardarProducto(Producto producto) {
        Producto nuevo = productoRepository.save(producto);

        // Registra ENTRADA automática al crear producto
        if (nuevo.getCantidad() > 0) {
            registrarMovimiento(nuevo, "ENTRADA", nuevo.getCantidad());
        }

        return nuevo;
    }

    // =========================
    // LISTAR TODOS
    // =========================
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // =========================
    // OBTENER POR ID
    // =========================
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Producto no encontrado con ID: " + id));
    }

    // =========================
    // ACTUALIZAR
    // =========================
    public Producto actualizarProducto(Long id, Producto producto) {
        Producto existente = obtenerPorId(id);

        int cantidadAnterior = existente.getCantidad();
        int cantidadNueva = producto.getCantidad();

        existente.setNombre(producto.getNombre());
        existente.setCantidad(cantidadNueva);
        existente.setPrecio(producto.getPrecio());
        existente.setCategoria(producto.getCategoria());
        existente.setCodigoBarra(producto.getCodigoBarra());
        existente.setStockMinimo(producto.getStockMinimo());

        Producto actualizado = productoRepository.save(existente);

        // Registra movimiento automático según el cambio de cantidad
        int diferencia = cantidadNueva - cantidadAnterior;

        if (diferencia > 0) {
            // Aumentó la cantidad → ENTRADA
            registrarMovimiento(actualizado, "ENTRADA", diferencia);
        } else if (diferencia < 0) {
            // Disminuyó la cantidad → SALIDA
            registrarMovimiento(actualizado, "SALIDA", Math.abs(diferencia));
        }

        return actualizado;
    }

    // =========================
    // ELIMINAR
    // =========================
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    // =========================
    // BUSCAR POR CÓDIGO DE BARRAS
    // =========================
    public Producto buscarPorCodigoBarra(String codigo) {
        return productoRepository.findByCodigoBarra(codigo)
                .orElseThrow(() ->
                        new RuntimeException("Producto no encontrado con código: " + codigo));
    }

    // =========================
    // PRODUCTOS CON STOCK BAJO
    // =========================
    public long productosConStockBajo() {
        return productoRepository.findAll()
                .stream()
                .filter(p -> p.getCantidad() <= p.getStockMinimo())
                .count();
    }

    // =========================
    // REGISTRAR MOVIMIENTO AUTOMÁTICO
    // =========================
    private void registrarMovimiento(Producto producto, String tipo, int cantidad) {
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setTipo(tipo);
        movimiento.setCantidad(cantidad);
        movimientoRepository.save(movimiento);
    }
}