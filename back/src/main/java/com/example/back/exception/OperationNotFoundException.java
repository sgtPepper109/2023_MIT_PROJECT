package com.example.back.exception;

public class OperationNotFoundException extends RuntimeException{
    public OperationNotFoundException(String message) {
        super(message);
    }
}
