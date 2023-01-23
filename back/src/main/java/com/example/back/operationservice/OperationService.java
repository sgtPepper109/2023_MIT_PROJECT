package com.example.back.operationservice;

import com.example.back.GetURLContents;
import com.example.back.operation.Operation;
import com.example.back.operationrepo.OperationRepo;
import com.example.back.exception.OperationNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

@Service
public class OperationService {
    private final OperationRepo operationRepo;

    // Manipulation of operations to and from operationRepo
    @Autowired
    public OperationService(OperationRepo operationRepo) {
        this.operationRepo = operationRepo;
    }

    // Save an operation passed as argument in operationRepo
    public Operation addOperation(Operation operation) {
        // id and user_id not added yet
        return operationRepo.save(operation);
    }

    // Find all operations from operationRepo
    public List<Operation> findAllOperations() {
        return operationRepo.findAll();
    }

    // Update an operation that's passed in the argument
    public Operation updateOperation(Operation operation) {
        return operationRepo.save(operation);
    }

    // Find a single operation that has id mentioned
    public Operation findOperation(Long id) {
        // Exception is defined as a class separately
        return operationRepo.findOperationById(id)
                .orElseThrow(() -> new OperationNotFoundException("An operation with provided id " + id + " was not found"));
    }

    // Delete an operation that has mentioned id
    public void deleteOperation(Long id) {
        operationRepo.deleteOperationById(id);
    }

    public String getData() throws JsonProcessingException {
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData("http://localhost:5000/data");
    }

    public String getPlot() throws JsonProcessingException {
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData("http://localhost:5000/plot");
    }
}
