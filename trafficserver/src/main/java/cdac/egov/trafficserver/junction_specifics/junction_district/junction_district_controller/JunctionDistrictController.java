package cdac.egov.trafficserver.junction_specifics.junction_district.junction_district_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district.JunctionDistrict;
import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district.JunctionDistrictModel;
import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district_service.JunctionDistrictService;

@RestController
@RequestMapping("/junctionSpecifics/junctionDistrict")
public class JunctionDistrictController {
	private final JunctionDistrictService junctionDistrictService;
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(JunctionDistrictController.class);

	public JunctionDistrictController(JunctionDistrictService junctionDistrictService) {
		this.junctionDistrictService = junctionDistrictService;
	}
    
	@PostMapping("/addSingleJunctionDistrictMap")
	public ResponseEntity<JunctionDistrict> addSingleJunctionDistrictMap(@RequestBody JunctionDistrictModel junctionDistrictMapToBeAdded) {
		log.warn("POST: /junctionDistrict/addJunctionDistrictMap");
		return new ResponseEntity<>(
			junctionDistrictService.addJunctionDistrictMap(junctionDistrictMapToBeAdded),
			HttpStatus.CREATED
		);
	}
	
	@GetMapping("/getAllJunctionDistrictMaps")
	public ResponseEntity<List<JunctionDistrict>> getAllJunctionDistrictMaps() {
		log.info("GET: /junctionSpecifics/junctionDistrict/getAllJunctionDistrictMaps");
		return new ResponseEntity<>(junctionDistrictService.getAllJunctionDistrictMaps(), HttpStatus.OK);
	}
	
    @PostMapping("/updateJunctionDistrictMap")
    public ResponseEntity<List<JunctionDistrict>> update(@RequestParam String junction, @RequestBody JunctionDistrictModel updatedMap) {
		log.info("POST: /junctionSpecifics/junctionDistrict/updateJunctionDistrictMap");
        junctionDistrictService.update(junction, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping("/deleteJunctionDistrictMap")
    public void delete(@RequestParam String junction) {
		log.info("GET: /junctionSpecifics/junctionDistrict/deleteJunctionDistrictMap");
    	junctionDistrictService.delete(junction);
    }

}
