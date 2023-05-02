package cdac.egov.trafficserver.flask.flask_controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.flask.get_url_contents.GetURLContents;

@RestController
@RequestMapping("/process")
public class FlaskController {

	private Object csvData;
	private Object time;

	private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager
			.getLogger(FlaskController.class);

	@Value("${flask.url}")
	private String flaskUrl;

	public FlaskController() {
		/* NOTE: Document why this method is empty */ }

	@GetMapping("/getAllAlgorithms")
	public String getAllAlgorithms() {
		log.info("GET: /process/getAllAlgorithms");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllAlgorithms");
	}	

	@GetMapping("/getAllUniqueJunctions")
	public String getAllUniqueJunctions() {
		log.info("GET: /process/getAllUniqueJunctions");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllUniqueJunctions");
	}	
	
	@GetMapping("/checkIfTrained")
	public String checkIfTrained(@RequestParam String junction) {
		log.info("GET: /process/getTestingRatioComparisons");
		GetURLContents getURLContents = new GetURLContents();
		junction = junction.replaceAll("\\s", "%20");
		return getURLContents.getData(flaskUrl + "/checkIfTrained?junction=" + junction);
	}
	
	@GetMapping("/getTestingRatioComparisons")
	public String getTestingRatioComparisons(@RequestParam String action, @RequestParam String junction) {
		log.info("GET: /process/getTestingRatioComparisons");
		GetURLContents getURLContents = new GetURLContents();
		junction = junction.replaceAll("\\s", "%20");
		return getURLContents.getData(flaskUrl + "/getTestingRatioComparisons?action=" + action + "&junction=" + junction);
	}
	
	@GetMapping("/getAllModelSummaries")
	public String getModelSummaries() {
		log.info("GET: /process/getAllModelSummaries");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllModelSummaries");
	}	
	
	@GetMapping("/getActualVsPredictedComparisonTableData")
	public String getActualVsPredictedComparisonTableData() {
		log.info("GET: /process/getActualVsPredictedComparisonTableData");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getActualVsPredictedComparisonTableData");
	}	
	
	@GetMapping("/getActualVsPredictedComparison")
	public String getActualVsPredictedComparison() {
		log.info("GET: /process/getActualVsPredictedComparison");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getActualVsPredictedComparison");
	}	
	
	
	@GetMapping("/predictForHighestAccuracy")
	public String predictForHighestAccuracy(
		@RequestParam String junction,
		@RequestParam String algorithm,
		@RequestParam String testRatio
	) {
		log.info("GET: /process/predictForHighestAccuracy");
		GetURLContents getURLContents = new GetURLContents();
		
		algorithm = algorithm.replaceAll("\\s", "%20");
		junction = junction.replaceAll("\\s", "%20");
		
		return getURLContents.getData(
			flaskUrl + 
			"/predictForHighestAccuracy?junction=" + junction + 
			"&algorithm=" + algorithm + 
			"&testRatio=" + testRatio
		);
	}
	
	@GetMapping("/addToMaster")
	public String addToMaster(
		@RequestParam String junction,
		@RequestParam String algorithm,
		@RequestParam String testRatio,
		@RequestParam String startYear
	) {
		log.info("GET: /process/addToMaster");
		GetURLContents getURLContents = new GetURLContents();
		
		algorithm = algorithm.replaceAll("\\s", "%20");
		junction = junction.replaceAll("\\s", "%20");
		
		return getURLContents.getData(
			flaskUrl + 
			"/addToMaster?junction=" + junction + 
			"&algorithm=" + algorithm + 
			"&testRatio=" + testRatio +
			"&startYear=" + startYear
		);
	}

	@GetMapping("/getAllRelativeChange")
	public String getAllRelativeChange() {
		log.info("GET: /process/getAllRelativeChange");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllRelativeChange");
	}
	
	
	@GetMapping("/getStartYearMap")
	public String getStartYearMap() {
		log.info("GET: /process/getStartYearMap");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getStartYearMap");
	}
	
	
	@GetMapping("/getRelativeChange")
	public String getRelativeChange(@RequestParam String factor, @RequestParam String junction) {
		log.info("GET: /process/getRelativeChange");
		factor = factor.replaceAll("\\s", "%20");
		junction = junction.replaceAll("\\s", "%20");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getRelativeChange?factor=" + factor + "&junction=" + junction);
	}
	
	
	@GetMapping("/getMasterTrainedDataPlot")
	public String getMasterTrainedDataPlot() {
		log.info("GET: /process/getMasterTrainedDataPlot");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getMasterTrainedDataPlot");
	}
	
	@GetMapping("/getMasterTrainedDataTable")
	public String getMasterTrainedDataTable() {
		log.info("GET: /process/getMasterTrainedDataTable");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getMasterTrainedDataTable");
	}
	
	@GetMapping("/getMasterTrainedJunctionsAccuracies")
	public String getMasterTrainedJunctionsAccuracies() {
		log.info("GET: /process/getMasterTrainedJunctionsAccuracies");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getMasterTrainedJunctionsAccuracies");
	}
	
	@GetMapping("/getPlot")
	public String getPlot() {
		log.info("GET: /process/getPlot");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/plot");
	}	
	
	@GetMapping("/getAccuraciesOfAllJunctions")
	public String getAccuraciesOfAllJunctions() {
		log.info("GET: /process/getAccuraciesOfAllJunctions");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAccuraciesOfAllJunctions");
	}
	
	@GetMapping("/getAllJunctionsFuturePredictionsTable")
	public String getAllJunctionsFuturePredictionsTable() {
		log.info("GET: /process/getAllJunctionsFuturePredictionsTable");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctionsFuturePredictionsTable");
	}
	

	@GetMapping("/exchangeTime")
	public Object exchangeTime() {
		return this.time;
	}

	@PostMapping("/sendInputTimeToPredict")
	public String sendInputTimeToPredict(@RequestBody Object response) {
		this.time = response;
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/listenTime");
	}

	
	@GetMapping("/getFuturePredictionsTable")
	public String getFuturePredictionsTable() {
		log.info("GET: /process/getFuturePredictionsTable");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getFuturePredictionsTable");
	}

	@PostMapping("/setCsvData")
	public String getCsvData(@RequestBody Object response) {
		log.warn("POST: localhost:8080/process/setCsvData");
		this.csvData = response;
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getCsvData");
	}

	@GetMapping("/exchangeCsvData")
	public Object exhangeCsvData() {
		log.info("GET: /process/exchangeCsvData");
		return this.csvData;
	}

	@GetMapping("/getEndYearFromDataset")
	public String getEndDateFromDataset() {
		log.info("GET: /process/getEndYearFromDataset");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getEndYearFromDataset");
	}
}
