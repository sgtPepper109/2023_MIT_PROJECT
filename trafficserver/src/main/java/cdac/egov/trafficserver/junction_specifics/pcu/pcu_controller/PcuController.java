package cdac.egov.trafficserver.junction_specifics.pcu.pcu_controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.junction_specifics.pcu.pcu.Pcu;
import cdac.egov.trafficserver.junction_specifics.pcu.pcu.PcuModel;
import cdac.egov.trafficserver.junction_specifics.pcu.pcu_service.PcuService;

@RestController
@RequestMapping("/junctionSpecifics/pcu")
public class PcuController {

	private final PcuService pcuService;
	private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager
			.getLogger(PcuController.class);

	public PcuController(PcuService pcuService) {
		this.pcuService = pcuService;
	}
	
	@GetMapping("/getAllPcu")
	public List<Pcu> getAllPcu() {
		log.info("GET: /junctionSpecifics/pcu/getAllPcu");
		return pcuService.getAllPcus();
	}
	
	@PostMapping("/addSinglePcu")
	public ResponseEntity<Pcu> addSinglePcu(@RequestBody PcuModel pcuToBeAdded) {
		log.info("POST: /junctionSpecifics/pcu/addSinglePcu");
		return new ResponseEntity<>(
			pcuService.addPcu(pcuToBeAdded),
			HttpStatus.CREATED
		);
	}
	
    @PostMapping("/updatePcu")
    public void updatePcu(@RequestParam Integer roadwayWidth, @RequestBody PcuModel updatedMap) {
		log.info("POST: /junctionSpecifics/pcu/updatePcu");
        pcuService.update(roadwayWidth, updatedMap);
    }

    @GetMapping("/deletePcu")
    public void delete(@RequestParam Integer roadwayWidth) {
		log.info("GET: /junctionSpecifics/pcu/deletePcu");
    	pcuService.delete(roadwayWidth);
    }

}
