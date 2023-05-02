package com.example.back.junction_specifics;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.junction_specifics.junction_district.junction_district.JunctionDistrict;
import com.example.back.junction_specifics.junction_district.junction_district_service.JunctionDistrictService;
import com.example.back.junction_specifics.max_vehicles.max_vehicles_service.MaxVehiclesService;
import com.example.back.junction_specifics.roadway_widths.roadway_widths_service.RoadwayWidthsService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics")
public class JunctionSpecifics {
	
	private final JunctionDistrictService junctionDistrictService;
	private final RoadwayWidthsService roadwayWidthsService;
	private final MaxVehiclesService maxVehiclesService;

	public JunctionSpecifics(JunctionDistrictService junctionDistrictService,
			RoadwayWidthsService roadwayWidthsService,
			MaxVehiclesService maxVehiclesService) {
		this.junctionDistrictService = junctionDistrictService;
		this.roadwayWidthsService = roadwayWidthsService;
		this.maxVehiclesService = maxVehiclesService;
	}
	
	@GetMapping("/cleanJunctionSpecificTables")
	public ResponseEntity<?> cleanJunctionSpecificTables() {
		
		junctionDistrictService.truncateRedundantJunctionDistrictMaps();
		roadwayWidthsService.truncateRedundantJunctionRoadwayWidthMaps();
		maxVehiclesService.truncateRoadwayWidthMaxVehiclesMaps();
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	@GetMapping("/getAllJunctions")
	public ResponseEntity<List<String>> getAllJunctions() {
		List<JunctionDistrict> allJunctionDistrictMaps = this.junctionDistrictService.getAllJunctionDistrictMaps();
		List<String> allJunctions = new ArrayList<String>();
		for (JunctionDistrict j: allJunctionDistrictMaps) {
			allJunctions.add(j.getJunctionName());
		}
		return new ResponseEntity<>(allJunctions, HttpStatus.OK);
	}

}
