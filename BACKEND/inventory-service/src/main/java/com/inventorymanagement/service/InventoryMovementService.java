package com.inventorymanagement.service;

import com.inventorymanagement.model.InventoryMovement;
import com.inventorymanagement.repository.InventoryMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryMovementService {
    private final InventoryMovementRepository movementRepository;

    public InventoryMovementService(InventoryMovementRepository movementRepository) {
        this.movementRepository = movementRepository;
    }

    public List<InventoryMovement> getAllMovements() {
        return movementRepository.findAll();
    }

    public List<InventoryMovement> getMovementsByStore(Long storeId) {
        return movementRepository.findByStoreId(storeId);
    }

    public Map<String, Long> getMovementMetrics() {
        List<InventoryMovement> movements = movementRepository.findAll();
        return movements.stream()
                .collect(Collectors.groupingBy(InventoryMovement::getMovementType, Collectors.counting()));
    }
}