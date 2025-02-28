package com.inventorymanagement.service;

import com.inventorymanagement.model.Inventory;
import com.inventorymanagement.model.InventoryMovement;
import com.inventorymanagement.model.Product;
import com.inventorymanagement.model.Store;
import com.inventorymanagement.repository.InventoryMovementRepository;
import com.inventorymanagement.repository.InventoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;
    private final WebClient webClientStore;
    private final WebClient webClientProduct;
    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);

    public InventoryService(InventoryRepository inventoryRepository, InventoryMovementRepository movementRepository, WebClient.Builder webClientBuilder) {
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
        this.webClientStore = webClientBuilder.baseUrl("http://localhost:8080").build();
        this.webClientProduct = webClientBuilder.baseUrl("http://localhost:8082").build();
    }

    public void validateStoreAndProduct(Long storeId, Long productId, String token) {
        logger.info("Validating store ID {} and product ID {} with token: {}", storeId, productId, token);

        Store store = webClientStore.get()
                .uri("/stores/{storeId}", storeId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(Store.class)
                .blockOptional()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        Product product = webClientProduct.get()
                .uri("/products/{productId}", productId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(Product.class)
                .blockOptional()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        logger.info("Store and Product validated successfully. Store: {}, Product: {}", store.getName(), product.getName());
    }

    public Inventory updateStock(Long storeId, Long productId, int quantity, Long userId, String movementType) {
        Inventory inventory = inventoryRepository.findByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found"));

        if ("EXIT".equalsIgnoreCase(movementType) && inventory.getQuantity() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        }

        if ("ENTRY".equalsIgnoreCase(movementType)) {
            inventory.setQuantity(inventory.getQuantity() + quantity);
        } else {
            inventory.setQuantity(inventory.getQuantity() - quantity);
        }

        inventoryRepository.save(inventory);

        InventoryMovement movement = new InventoryMovement();
        movement.setStoreId(storeId);
        movement.setProductId(productId);
        movement.setUserId(userId);
        movement.setQuantity(quantity);
        movement.setMovementType(movementType);

        movementRepository.save(movement);
        logger.info("Inventory movement recorded: Store={}, Product={}, Type={}, Quantity={}", storeId, productId, movementType, quantity);

        return inventory;
    }

    public List<InventoryMovement> getAllMovements() {
        return movementRepository.findAll();
    }

    public List<InventoryMovement> getMovementsByStore(Long storeId) {
        return movementRepository.findByStoreId(storeId);
    }
}