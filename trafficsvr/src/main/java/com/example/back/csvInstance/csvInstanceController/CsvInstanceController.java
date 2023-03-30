package com.example.back.csvInstance.csvInstanceController;

import com.example.back.csvInstance.csvInstance.CsvInstance;
import com.example.back.csvInstance.csvInstanceService.CsvInstanceService;
import java.io.*;
import java.util.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/csvInstance")
public class CsvInstanceController {

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(CsvInstanceController.class);
    
    private CsvInstanceService csvInstanceService;

	public CsvInstanceController(CsvInstanceService csvInstanceService) {
		super();
		this.csvInstanceService = csvInstanceService;
	}
	
	@GetMapping("/getJunctionData")
	public ResponseEntity<List<CsvInstance>> getJunctionData(@RequestParam String junction) {
		return new ResponseEntity<>(csvInstanceService.getJunctionData(junction), HttpStatus.OK);
	}

	@GetMapping("/deleteJunctionData")
	public ResponseEntity<List<CsvInstance>> deleteJunctionData(@RequestParam String junction) {
		csvInstanceService.deleteJunctionData(junction);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("/getAllCsvInstances")
	public ResponseEntity<List<CsvInstance>> getAllCsvInstances() {
		return new ResponseEntity<>(csvInstanceService.getCsvInstances(), HttpStatus.OK);
	}
	
	@PostMapping("/addCsvInstances")
	public ResponseEntity<List<CsvInstance>> addCsvInstances(@RequestBody List<CsvInstance> csvInstancesToBeAdded) {
		return new ResponseEntity<List<CsvInstance>>(csvInstanceService.addCsvInstances(csvInstancesToBeAdded), HttpStatus.CREATED);
	}

}
