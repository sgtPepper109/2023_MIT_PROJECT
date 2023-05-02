package cdac.egov.trafficserver.recommended.recommended_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.recommended.recommended.Recommended;
import cdac.egov.trafficserver.recommended.recommended.RecommendedModel;
import cdac.egov.trafficserver.recommended.recommended_service.RecommendedService;

@RestController
@RequestMapping("/recommended")
public class RecommendedController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(RecommendedController.class);
    private final RecommendedService recommendedService;

	public RecommendedController(RecommendedService recommendedService) {
		super();
		this.recommendedService = recommendedService;
	}
	
	@GetMapping("/checkIfAlreadyRecommended")
	public boolean checkIfAlreadyRecommended(@RequestParam String junction, @RequestParam Integer startYear) {
		log.info("GET: /recommended/checkIfAlreadyRecommended");
		return !(recommendedService.getJunctionWithStartYear(junction, startYear).isEmpty());
	}

	@GetMapping("/getAllRecommended")
	public ResponseEntity<List<Recommended>> getAllRecommended() {
		log.info("GET: /recommended/getAllRecommended");
		return new ResponseEntity<>(recommendedService.getAllRecommended(), HttpStatus.OK);
	}
	
	@GetMapping("/getDistrictInstancesWithStartYear")
	public ResponseEntity<List<Recommended>> getDistrictInstancesWithStartYear(
			@RequestParam String district,
			@RequestParam Integer startYear
	) {
		log.info("GET: /recommended/getDistrictInstancesWithStartYear");
		return new ResponseEntity<>(
				recommendedService.getDistrictInstancesWithStartYear(district, startYear), 
				HttpStatus.OK
		);
	}
	
	@PostMapping("/addRecommended")
	public ResponseEntity<Recommended> addRecommended(@RequestBody RecommendedModel recommended) {
		log.info("POST: /recommended/addRecommended");
		return new ResponseEntity<>(recommendedService.addRecommended(recommended), HttpStatus.OK);
	}
	
	@GetMapping("/getJunctionInstances")
	public ResponseEntity<List<Recommended>> getJunctionInstances(@RequestParam String junction) {
		log.info("GET: /recommended/getJunctionInstances");
		return new ResponseEntity<>(recommendedService.getJunctionInstances(junction), HttpStatus.OK);
	}
	
	@GetMapping("/clearAllRecommended")
	public void clearAllRecommended() {
		log.info("GET: /recommended/clearAllRecommended");
		recommendedService.clearAllRecommended();
	}
	
	@GetMapping("deleteRecommendation")
	public void deleteRecommendation(@RequestParam String junction, @RequestParam String district, @RequestParam Integer startYear, @RequestParam Integer durationYears) {
		log.info("GET: /recommended/deleteRecommendation");
		recommendedService.deleteRecommendation(recommendedService.getJunctionWithStartYear(junction, startYear).get(0));
	}

}
