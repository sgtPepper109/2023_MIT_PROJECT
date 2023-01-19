package com.example.back.operationrepo;

import com.example.back.operation.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// The interface is used for holding the operations
public interface OperationRepo extends JpaRepository<Operation, Long> {
    // Delete operation by id (not recognized in OperationService)
    void deleteOperationById(Long id);

    // Find operation by id (not recognized in OperationService)
    Optional<Operation> findOperationById(Long id);
}
