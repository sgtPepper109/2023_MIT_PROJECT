package com.example.back.junctionSpecifics;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMap.JunctionRoadwayWidthMap;
import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMap.RoadwayWidthMaxVehiclesMap;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService.JunctionDistrictMapService;
import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapService.JunctionRoadwayWidthMapService;
import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapService.RoadwayWidthMaxVehiclesMapService;

import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics")
public class JunctionSpecifics {
	
	private final JunctionDistrictMapService junctionDistrictMapService;
	private final JunctionRoadwayWidthMapService junctionRoadwayWidthMapService;
	private final RoadwayWidthMaxVehiclesMapService roadwayWidthMaxVehiclesMapService;

	public JunctionSpecifics(JunctionDistrictMapService junctionDistrictMapService,
			JunctionRoadwayWidthMapService junctionRoadwayWidthMapService,
			RoadwayWidthMaxVehiclesMapService roadwayWidthMaxVehiclesMapService) {
		this.junctionDistrictMapService = junctionDistrictMapService;
		this.junctionRoadwayWidthMapService = junctionRoadwayWidthMapService;
		this.roadwayWidthMaxVehiclesMapService = roadwayWidthMaxVehiclesMapService;
	}
	
	@GetMapping("/cleanJunctionSpecificTables")
	public ResponseEntity<?> cleanJunctionSpecificTables() {
		
		junctionDistrictMapService.truncateRedundantJunctionDistrictMaps();
		junctionRoadwayWidthMapService.truncateRedundantJunctionRoadwayWidthMaps();
		roadwayWidthMaxVehiclesMapService.truncateRoadwayWidthMaxVehiclesMaps();
		
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
