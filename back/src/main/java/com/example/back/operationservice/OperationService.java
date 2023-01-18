package com.example.back.operationservice;

import com.example.back.operation.Operation;
import com.example.back.operationrepo.OperationRepo;
import com.example.back.exception.OperationNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {
    private final OperationRepo operationRepo;

    @Autowired
    public OperationService(OperationRepo operationRepo) {
        this.operationRepo = operationRepo;
    }

    public Operation addOperation(Operation operation) {
        // id and user_id not added yet
        return operationRepo.save(operation);
    }

    public List<Operation> findAllOperations() {
        return operationRepo.findAll();
    }

    public Operation updateOperation(Operation operation) {
        return operationRepo.save(operation);
    }

    public Operation findOperation(Long id) {
        return operationRepo.findOperationById(id)
                .orElseThrow(() -> new OperationNotFoundException("An operation with provided id " + id + " was not found"));
    }

    public void deleteOperation(Long id) {
        operationRepo.deleteOperationById(id);
    }
}
