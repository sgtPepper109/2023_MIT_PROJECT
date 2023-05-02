package cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths.RoadwayWidths;
import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths.RoadwayWidthsModel;
import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths_service.RoadwayWidthsService;

@RestController
@RequestMapping("/junctionSpecifics/roadwayWidths")
public class RoadwayWidthsController {

	private final RoadwayWidthsService roadwayWidthsService;
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(RoadwayWidthsController.class);

	public RoadwayWidthsController(RoadwayWidthsService roadwayWidthsService) {
		this.roadwayWidthsService = roadwayWidthsService;
	}
	
	@PostMapping("/addSingleJunctionRoadwayWidthMap")
	public ResponseEntity<RoadwayWidths> addSingleJunctionRoadwayWidthMap(@RequestBody RoadwayWidthsModel junctionRoadwayWidthMapToBeAdded) {
		log.warn("POST: /junctionRoadwayWidth/addJunctionRoadwayWidthMap");
		return new ResponseEntity<>(
			roadwayWidthsService.addJunctionRoadWayWidthMap(junctionRoadwayWidthMapToBeAdded),
			HttpStatus.CREATED
		);
	}
	
	@GetMapping("/getAllJunctionRoadwayWidthMaps")
	public ResponseEntity<List<RoadwayWidths>> getAllJunctionRoadwayWidthMaps() {
		log.info("GET: /junctionRoadwayWidth/getAllJunctionRoadwayWidthMaps");
		return new ResponseEntity<>(
			roadwayWidthsService.getAllJunctionRoadwayWidthMaps(),
			HttpStatus.OK
		);
	}
	
    @PostMapping("/updateJunctionRoadwayWidthMap")
    public void update(@RequestParam String junction, @RequestBody RoadwayWidthsModel updatedMap) { 
    	roadwayWidthsService.update(junction, updatedMap); 
    }

    @GetMapping("/deleteJunctionRoadwayWidthMap")
    public void delete(@RequestParam String junction) { roadwayWidthsService.delete(junction); }
	
}
