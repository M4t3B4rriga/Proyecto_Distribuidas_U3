package com.retailinventory.service;

import com.retailinventory.model.Store;
import com.retailinventory.repository.StoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {
    private final StoreRepository storeRepository;

    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    public Optional<Store> getStoreById(Long id) {
        return storeRepository.findById(id);
    }

    public Store createStore(Store store) {
        if (storeRepository.findByName(store.getName()).isPresent()) {
            throw new RuntimeException("A store with this name already exists.");
        }
        return storeRepository.save(store);
    }

    public Store updateStore(Long id, Store updatedStore) {
        return storeRepository.findById(id).map(existingStore -> {
            existingStore.setName(updatedStore.getName());
            existingStore.setAddress(updatedStore.getAddress());
            return storeRepository.save(existingStore);
        }).orElseThrow(() -> new RuntimeException("Store not found"));
    }

    public void deleteStore(Long id) {
        if (!storeRepository.existsById(id)) {
            throw new RuntimeException("Store not found");
        }
        storeRepository.deleteById(id);
    }

    public List<Store> findStoresByName(String name) {
        return storeRepository.findByAddressContainingIgnoreCase(name);
    }
}