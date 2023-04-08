package com.example.back.districtTreatmentCount.districtTreatmentCountController;

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
		return new ResponseEntity<List<DistrictTreatmentCount>>(districtTreatmentCountService.getAllDistrictTreamentCounts(), HttpStatus.OK);
	}
	
	@GetMapping("/increaseDistrictTreatmentCount")
	public ResponseEntity<DistrictTreatmentCount> increaseDistrictTreatmentCount(@RequestParam String districtName) {
		List<DistrictTreatmentCount> existing = districtTreatmentCountService.getDistrictInstances(districtName);
		DistrictTreatmentCount firstTreatment = new DistrictTreatmentCount();
		if (existing.isEmpty()) {
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(1);
		} else {
			firstTreatment.setDistrictName(districtName);
			firstTreatment.setNumberOfTreatmentRecommendations(existing.get(0).getNumberOfTreatmentRecommendations() + 1);
			districtTreatmentCountService.deleteDistrictTreatmentCount(firstTreatment);
		}
		return new ResponseEntity<DistrictTreatmentCount>(districtTreatmentCountService.addDistrictTreatmentCount(firstTreatment), HttpStatus.OK);
	}

}
