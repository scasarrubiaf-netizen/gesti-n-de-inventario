package com.inventarios.plataforma_inventarios.controller;

import com.inventarios.plataforma_inventarios.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // =========================
    // RESUMEN GENERAL DASHBOARD
    // =========================
    @GetMapping("/resumen")
    public Map<String, Object> obtenerDashboard() {

        Map<String, Object> data = new HashMap<>();
        data.put("totalProductos", dashboardService.totalProductos());
        data.put("totalCategorias", dashboardService.totalCategorias());
        data.put("totalMovimientos", dashboardService.totalMovimientos());
        data.put("stockTotal", dashboardService.stockTotal());

        return data;
    }
}



