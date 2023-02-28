package com.example.back.junctionSpecifics.districts.districtsController;

import com.example.back.junctionSpecifics.districts.districts.Districts;
import com.example.back.junctionSpecifics.districts.districtsService.DistrictsService;

import lombok.extern.log4j.Log4j2;

import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/districts")
public class DistrictsController {

	private final DistrictsService districtsService;
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(DistrictsController.class);
    
    
	public DistrictsController(DistrictsService districtsService) {
		this.districtsService = districtsService;
	}
	

	@GetMapping("/getAllDistricts")
	public List<Districts> getAllDistricts() {
		List<Districts> districts = districtsService.getAllDistricts();
		return districts;
	}
    
    
}
