package com.retailinventory.controller;

import com.retailinventory.model.Store;
import com.retailinventory.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stores")
public class StoreController {
    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    // ✅ Get all stores (Accessible to all authenticated users)
    @GetMapping
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    // ✅ Get a store by ID (Accessible to all authenticated users)
    @GetMapping("/{id}")
    public ResponseEntity<?> getStoreById(@PathVariable Long id) {
        Optional<Store> store = storeService.getStoreById(id);
        return store.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Create a new store (Only ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStore(@Valid @RequestBody Store store) {
        return ResponseEntity.ok(storeService.createStore(store));
    }

    // ✅ Update store information (Only ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStore(@PathVariable Long id, @Valid @RequestBody Store store) {
        return ResponseEntity.ok(storeService.updateStore(id, store));
    }

    // ✅ Delete a store (Only ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok("Store deleted successfully");
    }
}