package com.example.back.operation.operationService;

import com.example.back.operation.operationModel.OperationModel;
import com.example.back.operation.operationRepository.OperationRepo;
import com.example.back.operation.operationNotFoundException.OperationNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OperationService {
    private final OperationRepo operationRepo;

    // Manipulation of operations to and from operationRepo
    @Autowired
    public OperationService(OperationRepo operationRepo) {
        this.operationRepo = operationRepo;
    }

    // Save an operation passed as argument in operationRepo
    public OperationModel addOperation(OperationModel operationModel) {
        // id and user_id not added yet
        return operationRepo.save(operationModel);
    }

    // Find all operations from operationRepo
    public List<OperationModel> findAllOperations() {
        return operationRepo.findAll();
    }

    // Update an operation that's passed in the argument
    public OperationModel updateOperation(OperationModel operationModel) {
        return operationRepo.save(operationModel);
    }

    // Find a single operation that has id mentioned
    public OperationModel findOperation(Long id) {
        // Exception is defined as a class separately
        return operationRepo.findOperationById(id)
                .orElseThrow(() -> new OperationNotFoundException("An operation with provided id " + id + " was not found"));
    }

    // Delete an operation that has mentioned id
    public void deleteOperation(Long id) {
        operationRepo.deleteOperationById(id);
    }

    public OperationModel findLastOperation() {
        List<OperationModel> operationModels = operationRepo.findAll();
        return operationModels.get(operationModels.size() -1);
    }
}