package com.productmanagement.controller;

import com.productmanagement.model.Product;
import com.productmanagement.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Received request to GET all products.");
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        logger.info("Received request to GET product with ID: {}", id);
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> {
            logger.warn("Product with ID {} not found", id);
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        logger.info("Received request to CREATE product: {}", product);

        try {
            Product createdProduct = productService.createProduct(product);
            logger.info("Product created successfully: {}", createdProduct);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            logger.error("Error while creating product: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error creating product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        logger.info("Received request to UPDATE product with ID: {}", id);
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        logger.info("Received request to DELETE product with ID: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}