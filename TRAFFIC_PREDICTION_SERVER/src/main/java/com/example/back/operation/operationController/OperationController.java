package com.example.back.operation.operationController;

import com.example.back.operation.operationModel.OperationModel;
import com.example.back.operation.operationService.OperationService;

import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequestMapping("/operation")
public class OperationController {
    private final OperationService operationService;
    
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(OperationController.class);
    
    // query data with help of operationService class
    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    // Note: All functions map to corresponding functions in the OperationService class
    @GetMapping("/all")
    public ResponseEntity<List<OperationModel>> getAllOperations() {
        log.info("GET: localhost:8080/operation/all");
        List<OperationModel> operationModels = operationService.findAllOperations();
        return new ResponseEntity<>(operationModels, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<OperationModel> getOperation(@PathVariable("id") Long id) {
        log.info("GET: localhost:8080/operation/find/{id}");
        OperationModel operationModel = operationService.findOperation(id);
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<OperationModel> addOperation(@RequestBody OperationModel operationModelToBeAdded) {
        log.warn("POST: localhost:8080/operation/add");
        OperationModel operationModel = operationService.addOperation(operationModelToBeAdded);
        return new ResponseEntity<>(operationModel, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<OperationModel> updateOperation(@RequestBody OperationModel operationModelToBeUpdated) {
        log.warn("UPDATE: localhost:8080/operation/add");
        OperationModel operationModel = operationService.updateOperation(operationModelToBeUpdated);
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOperation(@PathVariable("id") Long id) {
        log.warn("DELETE: localhost:8080/operation/delete/{id}");
        operationService.deleteOperation(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("findLast")
    public ResponseEntity<OperationModel> findLastOperation() {
        log.info("GET: localhost:8080/operation/findLast");
        OperationModel operationModel = operationService.findLastOperation();
        return new ResponseEntity<>(operationModel, HttpStatus.OK);
    }
    
    @GetMapping("/test")
    public ResponseEntity<List<Object>> test() {
        log.info("GET: localhost:8080/operation/test");
        List<Object> operationModels = operationService.test();
        return new ResponseEntity<>(operationModels, HttpStatus.OK);
    }
    
}
