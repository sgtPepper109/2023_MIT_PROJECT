package com.example.back.operation.operationRepository;

import com.example.back.operation.operationModel.OperationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

// The interface is used for holding the operations
public interface OperationRepo extends JpaRepository<OperationModel, Long> {
    // Delete operation by id (not recognized in OperationService)
    void deleteOperationById(Long id);

    // Find operation by id (not recognized in OperationService)
    Optional<OperationModel> findOperationById(Long id);
}
