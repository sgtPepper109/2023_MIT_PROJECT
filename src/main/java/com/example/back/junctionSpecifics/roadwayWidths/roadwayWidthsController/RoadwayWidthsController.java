package com.example.back.junctionSpecifics.roadwayWidths.roadwayWidthsController;

import com.example.back.junctionSpecifics.roadwayWidths.roadwayWidths.RoadwayWidths;
import com.example.back.junctionSpecifics.roadwayWidths.roadwayWidthsService.RoadwayWidthsService;

import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/roadwayWidths")
public class RoadwayWidthsController {
	
	private final RoadwayWidthsService roadwayWidthsService;

	public RoadwayWidthsController(RoadwayWidthsService roadwayWidthsService) {
		this.roadwayWidthsService = roadwayWidthsService;
	}
	
	@GetMapping("/getAllRoadwayWidths")
	public List<RoadwayWidths> getAllRoadwayWidths() {
		List<RoadwayWidths> roadwayWidths = roadwayWidthsService.getAllRoadwayWidths();
		return roadwayWidths;
	}
	

}
