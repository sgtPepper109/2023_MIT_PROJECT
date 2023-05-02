package com.example.back.junction_specifics.roadway_widths.roadway_widths_controller;

import com.example.back.junction_specifics.roadway_widths.roadway_widths.RoadwayWidths;
import com.example.back.junction_specifics.roadway_widths.roadway_widths_service.RoadwayWidthsService;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/junctionRoadwayWidth")
public class RoadwayWidthsController {

	private final RoadwayWidthsService roadwayWidthsService;

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(RoadwayWidthsController.class);

	public RoadwayWidthsController(RoadwayWidthsService roadwayWidthsService) {
		this.roadwayWidthsService = roadwayWidthsService;
	}
	
	@PostMapping("/addJunctionRoadwayWidthMap")
	public ResponseEntity<RoadwayWidths> addJunctionRoadwayWidthMap(@RequestBody List<RoadwayWidths> junctionRoadwayWidthMapsToBeAdded) {
		
		log.warn("DELETE: /junctionRoadwayWidth/truncateRedundantRoadwayWidthMaps");
		roadwayWidthsService.truncateRedundantJunctionRoadwayWidthMaps();
		System.out.println(roadwayWidthsService.getAllJunctionRoadwayWidthMaps());
		
		System.out.println(junctionRoadwayWidthMapsToBeAdded);
		for (RoadwayWidths i: junctionRoadwayWidthMapsToBeAdded) {
			log.warn("POST: /junctionRoadwayWidth/addJunctionRoadwayWidthMap");
			RoadwayWidths roadwayWidths = roadwayWidthsService.addJunctionRoadWayWidthMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	
	@PostMapping("/addSingleJunctionRoadwayWidthMap")
	public ResponseEntity<RoadwayWidths> addSingleJunctionRoadwayWidthMap(@RequestBody RoadwayWidths junctionRoadwayWidthMapToBeAdded) {
		
		log.warn("POST: /junctionRoadwayWidth/addJunctionRoadwayWidthMap");
		RoadwayWidths roadwayWidths = roadwayWidthsService.addJunctionRoadWayWidthMap(junctionRoadwayWidthMapToBeAdded);
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/getAllJunctionRoadwayWidthMaps")
	public List<RoadwayWidths> getAllJunctionRoadwayWidthMaps() {
		List<RoadwayWidths> roadwayWidths = roadwayWidthsService.getAllJunctionRoadwayWidthMaps();
		return  roadwayWidths;
	}
	
    @PostMapping("/updateJunctionRoadwayWidthMap")
    public ResponseEntity<List<RoadwayWidths>> update(@RequestParam String junction, @RequestBody RoadwayWidths updatedMap) {
        System.out.println(junction + updatedMap);
        roadwayWidthsService.update(junction, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/deleteJunctionRoadwayWidthMap")
    public ResponseEntity<?> delete(@RequestParam String junction) {
    	roadwayWidthsService.delete(junction);
    	return new ResponseEntity<>(HttpStatus.OK);
    }
	
}
