package com.example.back.junctionSpecifics;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService.JunctionDistrictMapService;
import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapService.JunctionRoadwayWidthMapService;
import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapService.RoadwayWidthMaxVehiclesMapService;

import lombok.extern.log4j.Log4j2;

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
	
}
