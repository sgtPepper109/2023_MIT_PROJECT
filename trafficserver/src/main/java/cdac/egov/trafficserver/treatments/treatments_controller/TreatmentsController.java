package cdac.egov.trafficserver.treatments.treatments_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.treatments.treatments.Treatments;
import cdac.egov.trafficserver.treatments.treatments_service.TreatmentsService;

@RestController
@RequestMapping("/treatments")
public class TreatmentsController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(TreatmentsController.class);
    private final TreatmentsService treatmentsService;

	public TreatmentsController(TreatmentsService treatmentsService) {
		super();
		this.treatmentsService = treatmentsService;
	}
	
	@GetMapping("/getAllDistrictTreatmentCounts")
	public ResponseEntity<List<Treatments>> getAllDistrictTreatmentCount() {
		log.info("GET: /treatments/getAllDistrictTreatmentCounts");
		return new ResponseEntity<>(treatmentsService.getAllDistrictTreatmentCounts(), HttpStatus.OK);
	}
	
	@GetMapping("/clearAllDistrictTreatmentCounts")
	public void clearAllDistrictTreatmentCounts() {
		log.info("GET: /treatments/clearAllDistrictTreatmentCounts");
		treatmentsService.clearAllDistrictTreatmentCounts();
	}

	@GetMapping("/decreaseDistrictTreatmentCount")
	public void decreaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear) {
		log.info("GET: /treatments/decreaseDistrictTreatmentCount");
		treatmentsService.decreaseDistrictTreatmentCounts(districtName, startYear);
	}
	
	@GetMapping("/increaseDistrictTreatmentCount")
	public ResponseEntity<Treatments> increaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear, @RequestParam Integer durationYears) {
		log.info("GET: /treatments/increaseDistrictTreatmentCount");
		return new ResponseEntity<>(
			treatmentsService.increaseDistrictTreatmentCount(districtName, startYear, durationYears),
			HttpStatus.OK
		);
	}
	
}
