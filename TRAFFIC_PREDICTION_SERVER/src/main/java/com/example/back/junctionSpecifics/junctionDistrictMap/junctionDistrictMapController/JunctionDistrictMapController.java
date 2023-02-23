package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapController;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService.JunctionDistrictMapService;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionDistrict")
public class JunctionDistrictMapController {
	private final JunctionDistrictMapService junctionDistrictMapService;
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionDistrictMapController.class);

	public JunctionDistrictMapController(JunctionDistrictMapService junctionDistrictMapService) {
		this.junctionDistrictMapService = junctionDistrictMapService;
	}
    
	
	@PostMapping("/addJunctionDistrictMap")
	public ResponseEntity<JunctionDistrictMap> addJunctionDistrictMap(@RequestBody List<JunctionDistrictMap> junctionDistrictMapsToBeAdded) {
		
//		log.warn("DELETE: /junctionDistrict/truncateRedundantJunctionDistrictMaps");
//		junctionDistrictMapService.truncateRedundantJunctionDistrictMaps();
		
		for (JunctionDistrictMap i: junctionDistrictMapsToBeAdded) {
			log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
			JunctionDistrictMap junctionDistrictMap = junctionDistrictMapService.addJunctionDistrictMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

    

}
