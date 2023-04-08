package com.example.back.recommended.recommendedController;

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
import com.example.back.recommended.recommendedService.RecommendedService;

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

	@GetMapping("/getAllRecommended")
	public ResponseEntity<List<Recommended>> getAllRecommended() {
		return new ResponseEntity<List<Recommended>>(recommendedService.getAllRecommended(), HttpStatus.OK);
	}
	
	@PostMapping("/addRecommended")
	public ResponseEntity<Recommended> addRecommended(@RequestBody Recommended recommended) {
		return new ResponseEntity<Recommended>(recommendedService.addRecommended(recommended), HttpStatus.OK);
	}
	
	@GetMapping("/getJunctionInstances")
	public ResponseEntity<List<Recommended>> getJunctionInstances(@RequestParam String junction) {
		return new ResponseEntity<List<Recommended>>(recommendedService.getJunctionInstances(junction), HttpStatus.OK);
	}

}
