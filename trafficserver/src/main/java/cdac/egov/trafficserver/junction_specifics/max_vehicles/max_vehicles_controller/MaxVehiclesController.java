package cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles.MaxVehicles;
import cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles_service.MaxVehiclesService;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/junctionSpecifics/maxVehicles")
public class MaxVehiclesController {

	private final MaxVehiclesService maxVehiclesService;

	public MaxVehiclesController(MaxVehiclesService maxVehiclesService) {
		this.maxVehiclesService = maxVehiclesService;
	}
	
	@GetMapping("/getAllRoadwayWidthMaxVehiclesMaps")
	public List<MaxVehicles> getAllRoadwayWidthMaxVehiclesMaps() {
		List<MaxVehicles> maxVehicles = maxVehiclesService.getAllRoadwayWidthMaxVehiclesMaps();
		return maxVehicles;
	}
	
	@PostMapping("/addRoadwayWidthMaxVehiclesMaps")
	public ResponseEntity<MaxVehicles> addRoadwayWidthMaxVehiclesMaps(@RequestBody List<MaxVehicles> roadwayWidthMaxVehiclesMapsToBeAdded) {
		maxVehiclesService.truncateRoadwayWidthMaxVehiclesMaps();

		for (MaxVehicles i: roadwayWidthMaxVehiclesMapsToBeAdded) {
			MaxVehicles maxVehicles = maxVehiclesService.addRoadwayWidthMaxVehiclesMap(i);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	
	
	@PostMapping("/addSingleRoadwayWidthMaxVehiclesMaps")
	public ResponseEntity<MaxVehicles> addSingleRoadwayWidthMaxVehiclesMaps(@RequestBody MaxVehicles roadwayWidthMaxVehiclesMapToBeAdded) {
		MaxVehicles maxVehicles = maxVehiclesService.addRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMapToBeAdded);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
    @PostMapping("/updateRoadwayWidthMaxVehiclesMap")
    public ResponseEntity<List<MaxVehicles>> update(@RequestParam Integer roadwayWidth, @RequestBody MaxVehicles updatedMap) {
        System.out.println(roadwayWidth);
        maxVehiclesService.update(roadwayWidth, updatedMap);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/deleteRoadwayWidthMaxVehiclesMap")
    public ResponseEntity<?> delete(@RequestParam Integer roadwayWidth) {
    	maxVehiclesService.delete(roadwayWidth);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
