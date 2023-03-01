package com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapController;

import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMap.RoadwayWidthMaxVehiclesMap;
import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapService.RoadwayWidthMaxVehiclesMapService;

import lombok.extern.log4j.Log4j2;

import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/roadwayWidthMaxVehicles")
public class RoadwayWidthMaxVehiclesMapController {

	private final RoadwayWidthMaxVehiclesMapService roadwayWidthMaxVehiclesMapService;

	public RoadwayWidthMaxVehiclesMapController(RoadwayWidthMaxVehiclesMapService roadwayWidthMaxVehiclesMapService) {
		this.roadwayWidthMaxVehiclesMapService = roadwayWidthMaxVehiclesMapService;
	}
	
	@GetMapping("/getAllRoadwayWidthMaxVehiclesMaps")
	public List<RoadwayWidthMaxVehiclesMap> getAllRoadwayWidthMaxVehiclesMaps() {
		List<RoadwayWidthMaxVehiclesMap> roadwayWidthMaxVehiclesMaps = roadwayWidthMaxVehiclesMapService.getAllRoadwayWidthMaxVehiclesMaps();
		return roadwayWidthMaxVehiclesMaps;
	}
	
	@PostMapping("/addRoadwayWidthMaxVehiclesMaps")
	public ResponseEntity<RoadwayWidthMaxVehiclesMap> addRoadwayWidthMaxVehiclesMaps(@RequestBody List<RoadwayWidthMaxVehiclesMap> roadwayWidthMaxVehiclesMapsToBeAdded) {
		roadwayWidthMaxVehiclesMapService.truncateRoadwayWidthMaxVehiclesMaps();

		for (RoadwayWidthMaxVehiclesMap i: roadwayWidthMaxVehiclesMapsToBeAdded) {
			RoadwayWidthMaxVehiclesMap roadwayWidthMaxVehiclesMap = roadwayWidthMaxVehiclesMapService.addRoadwayWidthMaxVehiclesMap(i);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

}
