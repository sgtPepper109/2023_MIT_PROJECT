package com.example.back.operationrepo;

import com.example.back.operation.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OperationRepo extends JpaRepository<Operation, Long> {
    void deleteOperationById(Long id);

    Optional<Operation> findOperationById(Long id);
}
