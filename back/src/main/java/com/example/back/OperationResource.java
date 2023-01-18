package com.example.back;

import com.example.back.operation.Operation;
import com.example.back.operationservice.OperationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation")
public class OperationResource {
    private final OperationService operationService;

    public OperationResource(OperationService operationService) {
        this.operationService = operationService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Operation>> getAllOperations() {
        List<Operation> operations = operationService.findAllOperations();
        return new ResponseEntity<>(operations, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Operation> getOperation(@PathVariable("id") Long id) {
        Operation operation = operationService.findOperation(id);
        return new ResponseEntity<>(operation, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Operation> addOperation(@RequestBody Operation operationToBeAdded) {
        Operation operation = operationService.addOperation(operationToBeAdded);
        return new ResponseEntity<>(operation, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Operation> updateOperation(@RequestBody Operation operationToBeUpdated) {
        Operation operation = operationService.updateOperation(operationToBeUpdated);
        return new ResponseEntity<>(operation, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOperation(@PathVariable("id") Long id) {
        operationService.deleteOperation(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
