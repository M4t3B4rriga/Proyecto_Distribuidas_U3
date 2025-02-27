package com.inventorymanagement.service;

import com.inventorymanagement.model.Inventory;
import com.inventorymanagement.model.Product;
import com.inventorymanagement.model.Store;
import com.inventorymanagement.repository.InventoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final WebClient webClientStore;
    private final WebClient webClientProduct;
    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);

    public InventoryService(InventoryRepository inventoryRepository, WebClient.Builder webClientBuilder) {
        this.inventoryRepository = inventoryRepository;
        this.webClientStore = webClientBuilder.baseUrl("http://localhost:8080").build();  // ✅ Correct store-service URL
        this.webClientProduct = webClientBuilder.baseUrl("http://localhost:8082").build(); // ✅ Correct product-service URL
    }


    public void validateStoreAndProduct(Long storeId, Long productId, String token) {
        logger.info("Validating store ID {} and product ID {} with token: {}", storeId, productId, token);

        // ✅ Fetch Store from Correct Service
        Store store = webClientStore.get()
                .uri("/stores/{storeId}", storeId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    logger.error("Store with ID {} not found! Response: {}", storeId, response.statusCode());
                    return response.createException().flatMap(ex -> {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found", ex);
                    });
                })
                .bodyToMono(Store.class)
                .doOnSuccess(response -> logger.info("Store-service response: {}", response))
                .doOnError(error -> logger.error("Error calling store-service: {}", error.getMessage(), error))
                .block();

        if (store == null || store.getId() == null) {
            logger.warn("Store with ID {} does not exist.", storeId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store does not exist");
        }

        // ✅ Fetch Product from Correct Service
        Product product = webClientProduct.get()
                .uri("/products/{productId}", productId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    logger.error("Product with ID {} not found! Response: {}", productId, response.statusCode());
                    return response.createException().flatMap(ex -> {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found", ex);
                    });
                })
                .bodyToMono(Product.class)
                .doOnSuccess(response -> logger.info("Product-service response: {}", response))
                .doOnError(error -> logger.error("Error calling product-service: {}", error.getMessage(), error))
                .block();

        if (product == null || product.getId() == null) {
            logger.warn("Product with ID {} does not exist.", productId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product does not exist");
        }

        logger.info("Store and Product validated successfully. Store: {}, Product: {}", store.getName(), product.getName());
    }

    public Inventory addInventory(Inventory inventory, String token) {
        validateStoreAndProduct(inventory.getStoreId(), inventory.getProductId(), token);
        return inventoryRepository.save(inventory);
    }

    public Inventory updateStock(Long storeId, Long productId, int quantity) {
        Inventory inventory = inventoryRepository.findByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found"));
        inventory.setQuantity(quantity);
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getInventoryByStore(Long storeId) {
        return inventoryRepository.findAll();
    }
}