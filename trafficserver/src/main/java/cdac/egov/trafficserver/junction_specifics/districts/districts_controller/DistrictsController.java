package cdac.egov.trafficserver.junction_specifics.districts.districts_controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.junction_specifics.districts.districts.Districts;
import cdac.egov.trafficserver.junction_specifics.districts.districts_service.DistrictsService;

@RestController
@RequestMapping("/junctionSpecifics/districts")
public class DistrictsController {

	private final DistrictsService districtsService;
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(DistrictsController.class);
    
    
	public DistrictsController(DistrictsService districtsService) {
		this.districtsService = districtsService;
	}
	
	@GetMapping("/getAllDistricts")
	public List<Districts> getAllDistricts() {
		log.info("GET: /junctionSpecifics/districts/getAllDistricts");
		return districtsService.getAllDistricts();
	}
    
    
}
