package com.example.back.junction_specifics.junction_district.junction_district_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.junction_specifics.junction_district.junction_district.JunctionDistrict;
import com.example.back.junction_specifics.junction_district.junction_district_service.JunctionDistrictService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/junctionDistrict")
public class JunctionDistrictController {
	private final JunctionDistrictService junctionDistrictService;
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionDistrictController.class);

	public JunctionDistrictController(JunctionDistrictService junctionDistrictService) {
		this.junctionDistrictService = junctionDistrictService;
	}
    
	
	@PostMapping("/addJunctionDistrictMap")
	public ResponseEntity<JunctionDistrict> addJunctionDistrictMap(@RequestBody List<JunctionDistrict> junctionDistrictMapsToBeAdded) {
		
		log.warn("DELETE: /junctionDistrict/truncateRedundantJunctionDistrictMaps");
		junctionDistrictService.truncateRedundantJunctionDistrictMaps();
		
		for (JunctionDistrict i: junctionDistrictMapsToBeAdded) {
			log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
			JunctionDistrict junctionDistrict = junctionDistrictService.addJunctionDistrictMap(i);
		}
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	
	@PostMapping("/addSingleJunctionDistrictMap")
	public ResponseEntity<JunctionDistrict> addSingleJunctionDistrictMap(@RequestBody JunctionDistrict junctionDistrictMapToBeAdded) {
		
		log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
		JunctionDistrict junctionDistrict = junctionDistrictService.addJunctionDistrictMap(junctionDistrictMapToBeAdded);
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/getAllJunctionDistrictMaps")
	public List<JunctionDistrict> getAllJunctionDistrictMaps() {
		List<JunctionDistrict> junctionDistricts = junctionDistrictService.getAllJunctionDistrictMaps();
		return junctionDistricts;
	}
	
    @PostMapping("/updateJunctionDistrictMap")
    public ResponseEntity<List<JunctionDistrict>> update(@RequestParam String junction, @RequestBody JunctionDistrict updatedMap) {
        System.out.println(junction + updatedMap);
        junctionDistrictService.update(junction, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping("/deleteJunctionDistrictMap")
    public ResponseEntity<?> delete(@RequestParam String junction) {
    	System.out.println(junction);
    	junctionDistrictService.delete(junction);
    	System.out.println(junctionDistrictService.getAllJunctionDistrictMaps());
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
