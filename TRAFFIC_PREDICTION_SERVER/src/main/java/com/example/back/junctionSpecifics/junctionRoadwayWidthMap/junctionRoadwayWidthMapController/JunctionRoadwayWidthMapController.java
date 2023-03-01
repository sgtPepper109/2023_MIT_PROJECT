package com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapController;

import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMap.JunctionRoadwayWidthMap;
import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapService.JunctionRoadwayWidthMapService;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/junctionRoadwayWidth")
public class JunctionRoadwayWidthMapController {

	private final JunctionRoadwayWidthMapService junctionRoadwayWidthMapService;

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionRoadwayWidthMapController.class);

	public JunctionRoadwayWidthMapController(JunctionRoadwayWidthMapService junctionRoadwayWidthMapService) {
		this.junctionRoadwayWidthMapService = junctionRoadwayWidthMapService;
	}
	
	@PostMapping("/addJunctionRoadwayWidthMap")
	public ResponseEntity<JunctionRoadwayWidthMap> addJunctionRoadwayWidthMap(@RequestBody List<JunctionRoadwayWidthMap> junctionRoadwayWidthMapsToBeAdded) {
		
		log.warn("DELETE: /junctionRoadwayWidth/truncateRedundantRoadwayWidthMaps");
		junctionRoadwayWidthMapService.truncateRedundantJunctionRoadwayWidthMaps();
		
		System.out.println(junctionRoadwayWidthMapsToBeAdded);
		for (JunctionRoadwayWidthMap i: junctionRoadwayWidthMapsToBeAdded) {
			log.warn("POST: /junctionRoadwayWidth/addJunctionRoadwayWidthMap");
			JunctionRoadwayWidthMap junctionRoadwayWidthMap = junctionRoadwayWidthMapService.addJunctionRoadWayWidthMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/getAllJunctionRoadwayWidthMaps")
	public List<JunctionRoadwayWidthMap> getAllJunctionRoadwayWidthMaps() {
		List<JunctionRoadwayWidthMap> junctionRoadwayWidthMaps = junctionRoadwayWidthMapService.getAllJunctionRoadwayWidthMaps();
		return  junctionRoadwayWidthMaps;
	}
	
}
