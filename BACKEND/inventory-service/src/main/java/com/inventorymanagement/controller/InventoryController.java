package com.inventorymanagement.controller;

import com.inventorymanagement.model.Inventory;
import com.inventorymanagement.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PutMapping("/{storeId}/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Inventory> updateStock(
            @PathVariable Long storeId,
            @PathVariable Long productId,
            @RequestParam int quantity,
            @RequestParam Long userId,
            @RequestParam String movementType) {
        return ResponseEntity.ok(inventoryService.updateStock(storeId, productId, quantity, userId, movementType));
    }
}