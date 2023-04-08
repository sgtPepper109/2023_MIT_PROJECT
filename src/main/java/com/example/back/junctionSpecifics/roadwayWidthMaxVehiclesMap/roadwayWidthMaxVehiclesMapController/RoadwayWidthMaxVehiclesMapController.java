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
	
	
	
	@PostMapping("/addSingleRoadwayWidthMaxVehiclesMaps")
	public ResponseEntity<RoadwayWidthMaxVehiclesMap> addSingleRoadwayWidthMaxVehiclesMaps(@RequestBody RoadwayWidthMaxVehiclesMap roadwayWidthMaxVehiclesMapToBeAdded) {
		RoadwayWidthMaxVehiclesMap roadwayWidthMaxVehiclesMap = roadwayWidthMaxVehiclesMapService.addRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMapToBeAdded);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
    @PostMapping("/updateRoadwayWidthMaxVehiclesMap")
    public ResponseEntity<List<RoadwayWidthMaxVehiclesMap>> update(@RequestParam Integer roadwayWidth, @RequestBody RoadwayWidthMaxVehiclesMap updatedMap) {
        System.out.println(roadwayWidth);
        roadwayWidthMaxVehiclesMapService.update(roadwayWidth, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/deleteRoadwayWidthMaxVehiclesMap")
    public ResponseEntity<?> delete(@RequestParam Integer roadwayWidth) {
    	roadwayWidthMaxVehiclesMapService.delete(roadwayWidth);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
