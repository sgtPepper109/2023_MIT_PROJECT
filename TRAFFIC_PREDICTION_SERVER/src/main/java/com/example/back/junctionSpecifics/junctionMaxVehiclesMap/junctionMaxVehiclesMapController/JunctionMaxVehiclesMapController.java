package com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMapController;

import com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMap.JunctionMaxVehiclesMap;
import com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMapService.JunctionMaxVehiclesMapService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionMaxVehicles")
public class JunctionMaxVehiclesMapController {
	private final JunctionMaxVehiclesMapService junctionMaxVehiclesMapService;
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionMaxVehiclesMapController.class);

	public JunctionMaxVehiclesMapController(JunctionMaxVehiclesMapService junctionMaxVehiclesMapService) {
		this.junctionMaxVehiclesMapService = junctionMaxVehiclesMapService;
	}
	
	
	@PostMapping("/addJunctionMaxVehiclesMap")
	public ResponseEntity<JunctionMaxVehiclesMap> addJunctionMaxVehiclesMap(@RequestBody List<JunctionMaxVehiclesMap> junctionMaxVehiclesMapToBeAdded) {
		
		log.warn("DELETE: /junctionMaxVehicles/truncateRedundantJunctionRoadwayWidthMap");
		junctionMaxVehiclesMapService.truncateRedundantJunctionMaxVehiclesMap();
		
		for (JunctionMaxVehiclesMap i: junctionMaxVehiclesMapToBeAdded) {
			log.warn("POST: /junctionMaxVehicles/addMaxVehiclesMap");
			JunctionMaxVehiclesMap junctionMaxVehiclesMap = junctionMaxVehiclesMapService.addJunctionMaxVehiclesMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/getJunctionMaxVehiclesMap")
	public List<JunctionMaxVehiclesMap> getJunctionMaxVehiclesMap() {
		log.warn("GET: /junctionMaxVehicles/getJunctionMaxVehiclesMap");
		List<JunctionMaxVehiclesMap> junctionMaxVehiclesMaps = junctionMaxVehiclesMapService.findAllJunctionMaxVehiclesMap();
		// heelo
		return junctionMaxVehiclesMaps;
	}

}
