package com.inventorymanagement.controller;

import com.inventorymanagement.model.Inventory;
import com.inventorymanagement.service.InventoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inventory> addInventory(@Valid @RequestBody Inventory inventory, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(inventoryService.addInventory(inventory, token.replace("Bearer ", "")));
    }

    @PutMapping("/{storeId}/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inventory> updateStock(@PathVariable Long storeId, @PathVariable Long productId, @RequestParam int quantity) {
        return ResponseEntity.ok(inventoryService.updateStock(storeId, productId, quantity));
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<List<Inventory>> getInventory(@PathVariable Long storeId) {
        return ResponseEntity.ok(inventoryService.getInventoryByStore(storeId));
    }
}