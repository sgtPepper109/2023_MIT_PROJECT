package com.example.back.treatments.treatments_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.treatments.treatments.Treatments;
import com.example.back.treatments.treatments_service.TreatmentsService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/districtTreatmentCount")
public class TreatmentsController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(TreatmentsController.class);
    private TreatmentsService treatmentsService;

	public TreatmentsController(TreatmentsService treatmentsService) {
		super();
		this.treatmentsService = treatmentsService;
	}
	
	
	@GetMapping("/getAllDistrictTreatmentCounts")
	public ResponseEntity<List<Treatments>> getAllDistrictTreatmentCount() {
		System.out.println(treatmentsService.getAllDistrictTreamentCounts());
		return new ResponseEntity<List<Treatments>>(treatmentsService.getAllDistrictTreamentCounts(), HttpStatus.OK);
	}
	
	@GetMapping("/clearAllDistrictTreatmentCounts")
	public void clearAllDistrictTreatmentCounts() { treatmentsService.clearAllDistrictTreatmentCounts(); }
	
	@GetMapping("/increaseDistrictTreatmentCount")
	public ResponseEntity<Treatments> increaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear, @RequestParam Integer durationYears) {
		List<Treatments> existing = treatmentsService.getDistrictInstances(districtName, startYear);
		Treatments firstTreatment = new Treatments();
		if (existing.isEmpty()) {
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(1);
			firstTreatment.setStartYear(startYear);
			firstTreatment.setDurationYears(durationYears);
		} else {
			treatmentsService.deleteDistrictTreatmentCount(existing.get(0));
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(existing.get(0).getNumberOfTreatmentRecommendations() + 1);
			firstTreatment.setStartYear(startYear);
			firstTreatment.setDurationYears(durationYears);
		}
		return new ResponseEntity<Treatments>(treatmentsService.addDistrictTreatmentCount(firstTreatment), HttpStatus.OK);
	}
	
	@GetMapping("/decreaseDistrictTreatmentCount")
	public void decreaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear) {
		List<Treatments> existing = treatmentsService.getDistrictInstances(districtName, startYear);
		if (!existing.isEmpty()) {
			Treatments recordExisting = existing.get(0);
			treatmentsService.deleteDistrictTreatmentCount(recordExisting);
			Integer currentNumberOfTreatments = recordExisting.getNumberOfTreatmentRecommendations();
			if (currentNumberOfTreatments != 1) {
				currentNumberOfTreatments --;
				recordExisting.setNumberOfTreatmentRecommendations(currentNumberOfTreatments);
				treatmentsService.addDistrictTreatmentCount(recordExisting);
			}
		}
	}

}
