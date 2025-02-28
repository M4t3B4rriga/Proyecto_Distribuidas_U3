package com.inventorymanagement.controller;

import com.inventorymanagement.model.InventoryMovement;
import com.inventorymanagement.service.InventoryMovementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory/movements")
public class InventoryMovementController {
    private final InventoryMovementService movementService;
    private static final Logger logger = LoggerFactory.getLogger(InventoryMovementController.class);

    public InventoryMovementController(InventoryMovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryMovement>> getAllMovements() {
        logger.info("ADMIN is accessing all inventory movements.");
        return ResponseEntity.ok(movementService.getAllMovements());
    }

    @GetMapping("/{storeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryMovement>> getMovementsByStore(@PathVariable Long storeId) {
        logger.info("ADMIN is accessing inventory movements for store: {}", storeId);
        return ResponseEntity.ok(movementService.getMovementsByStore(storeId));
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getMovementMetrics() {
        logger.info("ADMIN is accessing inventory movement metrics.");
        return ResponseEntity.ok(movementService.getMovementMetrics());
    }
}