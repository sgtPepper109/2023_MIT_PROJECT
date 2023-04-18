package com.example.back.districtTreatmentCount.districtTreatmentCountController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.districtTreatmentCount.districtTreatmentCount.DistrictTreatmentCount;
import com.example.back.districtTreatmentCount.districtTreatmentCountService.DistrictTreatmentCountService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/districtTreatmentCount")
public class DistrictTreatmentCountController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(DistrictTreatmentCountController.class);
    private DistrictTreatmentCountService districtTreatmentCountService;

	public DistrictTreatmentCountController(DistrictTreatmentCountService districtTreatmentCountService) {
		super();
		this.districtTreatmentCountService = districtTreatmentCountService;
	}
	
	
	@GetMapping("/getAllDistrictTreatmentCounts")
	public ResponseEntity<List<DistrictTreatmentCount>> getAllDistrictTreatmentCount() {
		System.out.println(districtTreatmentCountService.getAllDistrictTreamentCounts());
		return new ResponseEntity<List<DistrictTreatmentCount>>(districtTreatmentCountService.getAllDistrictTreamentCounts(), HttpStatus.OK);
	}
	
	@GetMapping("/clearAllDistrictTreatmentCounts")
	public void clearAllDistrictTreatmentCounts() { districtTreatmentCountService.clearAllDistrictTreatmentCounts(); }
	
	@GetMapping("/increaseDistrictTreatmentCount")
	public ResponseEntity<DistrictTreatmentCount> increaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear, @RequestParam Integer durationYears) {
		List<DistrictTreatmentCount> existing = districtTreatmentCountService.getDistrictInstances(districtName, startYear);
		DistrictTreatmentCount firstTreatment = new DistrictTreatmentCount();
		if (existing.isEmpty()) {
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(1);
			firstTreatment.setStartYear(startYear);
			firstTreatment.setDurationYears(durationYears);
		} else {
			districtTreatmentCountService.deleteDistrictTreatmentCount(existing.get(0));
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(existing.get(0).getNumberOfTreatmentRecommendations() + 1);
			firstTreatment.setStartYear(startYear);
			firstTreatment.setDurationYears(durationYears);
		}
		return new ResponseEntity<DistrictTreatmentCount>(districtTreatmentCountService.addDistrictTreatmentCount(firstTreatment), HttpStatus.OK);
	}
	
	@GetMapping("/decreaseDistrictTreatmentCount")
	public void decreaseDistrictTreatmentCount(@RequestParam String districtName, @RequestParam Integer startYear) {
		List<DistrictTreatmentCount> existing = districtTreatmentCountService.getDistrictInstances(districtName, startYear);
		if (!existing.isEmpty()) {
			DistrictTreatmentCount recordExisting = existing.get(0);
			districtTreatmentCountService.deleteDistrictTreatmentCount(recordExisting);
			Integer currentNumberOfTreatments = recordExisting.getNumberOfTreatmentRecommendations();
			if (currentNumberOfTreatments != 1) {
				currentNumberOfTreatments --;
				recordExisting.setNumberOfTreatmentRecommendations(currentNumberOfTreatments);
				districtTreatmentCountService.addDistrictTreatmentCount(recordExisting);
			}
		}
	}

}
