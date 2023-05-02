package cdac.egov.trafficserver.csv_instance.csv_instance_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.csv_instance.csv_instance.CsvInstance;
import cdac.egov.trafficserver.csv_instance.csv_instance_service.CsvInstanceService;

@RestController
@RequestMapping("/csvInstance")
public class CsvInstanceController {

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(CsvInstanceController.class);
    private final CsvInstanceService csvInstanceService;

	public CsvInstanceController(CsvInstanceService csvInstanceService) {
		super();
		this.csvInstanceService = csvInstanceService;
	}
	
	@GetMapping("/getJunctionData")
	public ResponseEntity<List<CsvInstance>> getJunctionData(@RequestParam String junction) {
		log.info("GET: /csvInstance/getJunctionData");
		return new ResponseEntity<>(csvInstanceService.getJunctionData(junction), HttpStatus.OK);
	}

	@GetMapping("/deleteJunctionData")
	public ResponseEntity<List<CsvInstance>> deleteJunctionData(@RequestParam String junction) {
		log.info("GET: /csvInstance/deleteJunctionData");
		csvInstanceService.deleteJunctionData(junction);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("/getAllCsvInstances")
	public ResponseEntity<List<CsvInstance>> getAllCsvInstances() {
		log.info("GET: /csvInstance/getAllCsvInstances");
		return new ResponseEntity<>(csvInstanceService.getCsvInstances(), HttpStatus.OK);
	}
	
	@PostMapping("/addCsvInstances")
	public ResponseEntity<List<CsvInstance>> addCsvInstances(@RequestBody List<CsvInstance> csvInstancesToBeAdded) {
		log.info("GET: /csvInstance/addCsvInstances");
		return new ResponseEntity<>(csvInstanceService.addCsvInstances(csvInstancesToBeAdded), HttpStatus.CREATED);
	}

}
