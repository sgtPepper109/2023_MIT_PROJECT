package com.example.back.operation.operationService;

import com.example.back.operation.operationModel.OperationModel;
import com.example.back.operation.operationRepository.OperationRepository;
import com.example.back.operation.operationNotFoundException.OperationNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {
	
	List<OperationModel> all;
	
    private final OperationRepository operationRepository;

    // Manipulation of operations to and from operationRepo
    @Autowired
    public OperationService(OperationRepository operationRepository) {
        this.operationRepository = operationRepository;
    }

    // Save an operation passed as argument in operationRepo
    public OperationModel addOperation(OperationModel operationModel) {
        // id and user_id not added yet
        return operationRepository.save(operationModel);
    }

    // Find all operations from operationRepo
    public List<OperationModel> findAllOperations() {
        return operationRepository.findAll();
    }

    // Update an operation that's passed in the argument
    public OperationModel updateOperation(OperationModel operationModel) {
        return operationRepository.save(operationModel);
    }

    // Find a single operation that has id mentioned
    public OperationModel findOperation(Long id) {
        // Exception is defined as a class separately
        return operationRepository.findOperationById(id)
                .orElseThrow(() -> new OperationNotFoundException("An operation with provided id " + id + " was not found"));
    }

    // Delete an operation that has mentioned id
    public void deleteOperation(Long id) {
        operationRepository.deleteOperationById(id);
    }

    public OperationModel findLastOperation() {
        List<OperationModel> operationModels = operationRepository.findAll();
        return operationModels.get(operationModels.size() -1);
    }
    
    public List<Object> test() {
    	return operationRepository.test();
    }
    
}
