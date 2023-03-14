package com.example.trafficsvr.operation.operationRepository;


import com.example.trafficsvr.operation.operationModel.OperationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

// The interface is used for holding the operations
public interface OperationRepository extends JpaRepository<OperationModel, Long> {
    // Delete operation by id (not recognized in OperationService)
    void deleteOperationById(Long id);

    // Find operation by id (not recognized in OperationService)
    Optional<OperationModel> findOperationById(Long id);

	
}
