package com.example.back.operation.operationController;

import com.example.back.operation.operationModel.OperationModel;
import com.example.back.operation.operationService.OperationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation")
public class OperationController {
    private final OperationService operationService;

    // query data with help of operationService class
    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    // Note: All functions map to corresponding functions in the OperationService class
    @GetMapping("/all")
    public ResponseEntity<List<OperationModel>> getAllOperations() {
        System.out.println("GET: localhost:8080/operation/all");
        List<OperationModel> operationModels = operationService.findAllOperations();
        return new ResponseEntity<>(operationModels, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<OperationModel> getOperation(@PathVariable("id") Long id) {
        System.out.println("GET: localhost:8080/operation/find/id");
        OperationModel operationModel = operationService.findOperation(id);
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<OperationModel> addOperation(@RequestBody OperationModel operationModelToBeAdded) {
        System.out.println("POST: localhost:8080/operation/add");
        OperationModel operationModel = operationService.addOperation(operationModelToBeAdded);
        return new ResponseEntity<>(operationModel, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<OperationModel> updateOperation(@RequestBody OperationModel operationModelToBeUpdated) {
        System.out.println("PUT: localhost:8080/operation/update");
        OperationModel operationModel = operationService.updateOperation(operationModelToBeUpdated);
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOperation(@PathVariable("id") Long id) {
        System.out.println("DELETE: localhost:8080/operation/delete/id");
        operationService.deleteOperation(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("findLast")
    public ResponseEntity<OperationModel> findLastOperation() {
        System.out.println("GET: localhost:8080/operation/findLast");
        OperationModel operationModel = operationService.findLastOperation();
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }
    
    @GetMapping("/getttAll")
    public ResponseEntity<List<OperationModel>> getttAll() {
        System.out.println("GET: localhost:8080/operation/getttAll");
        List<OperationModel> operationModels = operationService.getttAll();
        return new ResponseEntity<>(operationModels, HttpStatus.OK);
    }
}
