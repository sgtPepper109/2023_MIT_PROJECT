package com.example.back.recommended.recommended_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.recommended.recommended.Recommended;
import com.example.back.recommended.recommended_service.RecommendedService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/recommended")
public class RecommendedController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(RecommendedController.class);
    
    private RecommendedService recommendedService;

	public RecommendedController(RecommendedService recommendedService) {
		super();
		this.recommendedService = recommendedService;
	}
	
	
	
	@GetMapping("/checkIfAlreadyRecommended")
	public boolean checkIfAlreadyRecommended(@RequestParam String junction, @RequestParam Integer startYear) {
		List<Recommended> existing = recommendedService.getJunctionWithStartYear(junction, startYear);
		boolean response = false;
		response = (existing.isEmpty())? false: true;
		return response;
	}
	
	
	

	@GetMapping("/getAllRecommended")
	public ResponseEntity<List<Recommended>> getAllRecommended() {
		return new ResponseEntity<List<Recommended>>(recommendedService.getAllRecommended(), HttpStatus.OK);
	}
	
	@GetMapping("/getDistrictInstancesWithStartYear")
	public ResponseEntity<List<Recommended>> getDistrictInstancesWithStartYear(
			@RequestParam String district,
			@RequestParam Integer startYear
	) {
		return new ResponseEntity<List<Recommended>>(
				recommendedService.getDistrictInstancesWithStartYear(district, startYear), 
				HttpStatus.OK
		);
	}
	
	@PostMapping("/addRecommended")
	public ResponseEntity<Recommended> addRecommended(@RequestBody Recommended recommended) {
		return new ResponseEntity<Recommended>(
				recommendedService.addRecommended(recommended), 
				HttpStatus.OK
		);
	}
	
	@GetMapping("/getJunctionInstances")
	public ResponseEntity<List<Recommended>> getJunctionInstances(@RequestParam String junction) {
		return new ResponseEntity<List<Recommended>>(
				recommendedService.getJunctionInstances(junction), 
				HttpStatus.OK
		);
	}
	
	@GetMapping("/clearAllRecommended")
	public void clearAllRecommended() { recommendedService.clearAllRecommended(); }
	
	@GetMapping("deleteRecommendation")
	public void deleteRecommendation(@RequestParam String junction, @RequestParam String district, @RequestParam Integer startYear, @RequestParam Integer durationYears) {
		Recommended existing = recommendedService.getJunctionWithStartYear(junction, startYear).get(0);
		recommendedService.deleteRecommendation(existing);
	}

}
