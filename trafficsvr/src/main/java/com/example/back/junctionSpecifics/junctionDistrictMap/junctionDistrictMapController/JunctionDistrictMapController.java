package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapController;

import java.io.*;
import java.util.*;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService.JunctionDistrictMapService;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapRepository.JunctionDistrictMapRepository;

import lombok.extern.log4j.Log4j2;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/junctionDistrict")
public class JunctionDistrictMapController {
	private final JunctionDistrictMapService junctionDistrictMapService;
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionDistrictMapController.class);

	public JunctionDistrictMapController(JunctionDistrictMapService junctionDistrictMapService) {
		this.junctionDistrictMapService = junctionDistrictMapService;
	}
    
	
	@PostMapping("/addJunctionDistrictMap")
	public ResponseEntity<JunctionDistrictMap> addJunctionDistrictMap(@RequestBody List<JunctionDistrictMap> junctionDistrictMapsToBeAdded) {
		
		log.warn("DELETE: /junctionDistrict/truncateRedundantJunctionDistrictMaps");
		junctionDistrictMapService.truncateRedundantJunctionDistrictMaps();
		
		for (JunctionDistrictMap i: junctionDistrictMapsToBeAdded) {
			log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
			JunctionDistrictMap junctionDistrictMap = junctionDistrictMapService.addJunctionDistrictMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	
	@PostMapping("/addSingleJunctionDistrictMap")
	public ResponseEntity<JunctionDistrictMap> addSingleJunctionDistrictMap(@RequestBody JunctionDistrictMap junctionDistrictMapToBeAdded) {
		
		log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
		JunctionDistrictMap junctionDistrictMap = junctionDistrictMapService.addJunctionDistrictMap(junctionDistrictMapToBeAdded);
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/getAllJunctionDistrictMaps")
	public List<JunctionDistrictMap> getAllJunctionDistrictMaps() {
		List<JunctionDistrictMap> junctionDistrictMaps = junctionDistrictMapService.getAllJunctionDistrictMaps();
		return junctionDistrictMaps;
	}
	
    @PostMapping("/updateJunctionDistrictMap")
    public ResponseEntity<List<JunctionDistrictMap>> update(@RequestParam String junction, @RequestBody JunctionDistrictMap updatedMap) {
        System.out.println(junction + updatedMap);
        junctionDistrictMapService.update(junction, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping("/deleteJunctionDistrictMap")
    public ResponseEntity<?> delete(@RequestParam String junction) {
    	System.out.println(junction);
    	junctionDistrictMapService.delete(junction);
    	System.out.println(junctionDistrictMapService.getAllJunctionDistrictMaps());
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
