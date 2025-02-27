package com.productmanagement.service;

import com.productmanagement.model.Product;
import com.productmanagement.model.Store;
import com.productmanagement.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public ProductService(ProductRepository productRepository, WebClient.Builder webClientBuilder) {
        this.productRepository = productRepository;
        this.webClient = webClientBuilder.baseUrl("http://localhost:8080").build();
    }

    public void validateStoreExists(Long storeId) {
        logger.info("Validating if store with ID {} exists...", storeId);

        try {
            // Extract JWT Token from Security Context
            String token = extractJwtToken();
            logger.info("Extracted Bearer Token: {}", token != null ? "Token Found" : "No Token Found");

            Store store = webClient.get()
                    .uri("/stores/{storeId}", storeId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token) // 🔹 Send Authorization Header
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), response -> {
                        logger.error("Store with ID {} not found! Response: {}", storeId, response.statusCode());
                        return response.createException().flatMap(ex -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found", ex);
                        });
                    })
                    .onStatus(status -> status.is5xxServerError(), response -> {
                        logger.error("Server error while contacting store-service: {}", response.statusCode());
                        return response.createException().flatMap(ex -> {
                            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error contacting store-service", ex);
                        });
                    })
                    .bodyToMono(Store.class) // ✅ Corrected: Expecting Store Object Instead of Boolean
                    .doOnSuccess(response -> logger.info("Received store response: {}", response))
                    .doOnError(error -> logger.error("Error during WebClient call: {}", error.getMessage(), error))
                    .block();  // Blocking call to make synchronous request

            if (store == null || store.getId() == null) {
                logger.warn("Store with ID {} does not exist.", storeId);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store does not exist");
            }

            logger.info("Store with ID {} validated successfully.", storeId);
        } catch (Exception e) {
            logger.error("Error while validating store existence: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error contacting store-service");
        }
    }

    /**
     * Extracts the JWT token from the Security Context.
     */
    private String extractJwtToken() {
        if (SecurityContextHolder.getContext().getAuthentication() instanceof JwtAuthenticationToken jwtAuthToken) {
            Jwt jwt = (Jwt) jwtAuthToken.getCredentials();
            return jwt.getTokenValue();
        }
        return null;
    }

    public Product createProduct(Product product) {
        logger.info("Received request to CREATE product: {}", product);

        validateStoreExists(product.getStoreId());

        try {
            Product savedProduct = productRepository.save(product);
            logger.info("Product created successfully with ID: {}", savedProduct.getId());
            return savedProduct;
        } catch (Exception e) {
            logger.error("Error while saving product: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating product");
        }
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        logger.info("Received request to UPDATE product with ID: {}", id);

        return productRepository.findById(id).map(existingProduct -> {
            logger.info("Updating product with ID: {}", id);
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setCategory(updatedProduct.getCategory());

            Product updated = productRepository.save(existingProduct);
            logger.info("Product with ID {} updated successfully.", id);
            return updated;
        }).orElseThrow(() -> {
            logger.error("Product with ID {} not found.", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        });
    }

    public void deleteProduct(Long id) {
        logger.info("Received request to DELETE product with ID: {}", id);

        if (!productRepository.existsById(id)) {
            logger.warn("Product with ID {} not found.", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        productRepository.deleteById(id);
        logger.info("Product with ID {} deleted successfully.", id);
    }

    public List<Product> getAllProducts() {
        logger.info("Fetching all products...");
        List<Product> products = productRepository.findAll();
        logger.info("Fetched {} products.", products.size());
        return products;
    }

    public Optional<Product> getProductById(Long id) {
        logger.info("Fetching product with ID: {}", id);
        Optional<Product> product = productRepository.findById(id);

        if (product.isPresent()) {
            logger.info("Product with ID {} found: {}", id, product.get());
        } else {
            logger.warn("Product with ID {} not found.", id);
        }

        return product;
    }
}