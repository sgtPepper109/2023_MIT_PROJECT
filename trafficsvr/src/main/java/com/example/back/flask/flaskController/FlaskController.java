package com.example.back.flask.flaskController;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.back.flask.getUrlContents.GetURLContents;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/process")
public class FlaskController {

	private Object csvData;
	private Object input;
	private Object trainingSpecifics;
	private Object time;

	private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager
			.getLogger(FlaskController.class);

	@Value("${flask.url}")
	private String flaskUrl;

	public FlaskController() {
		/* NOTE: Document why this method is empty */ }

	@GetMapping("/getAllUniqueJunctions")
	public String getAllUniqueJunctions() {
		log.info("GET: /process/getAllUniqueJunctions");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllUniqueJunctions");
	}	
	
	
	@GetMapping("/getTestingRatioComparisons")
	public String getTestingRatioComparisons() {
		log.info("GET: /process/getTestingRatioComparisons");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getTestingRatioComparisons");
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
		@RequestParam String testRatio
	) {
		log.info("GET: /process/addToMaster");
		GetURLContents getURLContents = new GetURLContents();
		
		algorithm = algorithm.replaceAll("\\s", "%20");
		junction = junction.replaceAll("\\s", "%20");
		
		return getURLContents.getData(
			flaskUrl + 
			"/addToMaster?junction=" + junction + 
			"&algorithm=" + algorithm + 
			"&testRatio=" + testRatio
		);
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
	
	
	@GetMapping("/predictAllJunctions")
	public String trainAllJunctions() {
		log.info("GET: /process/predictAllJunctions");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/predictAllJunctions");
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
	
	@GetMapping("/predictAgainstTime")
	public String predictAgainstTime() {
		log.info("GET: /process/predictAgainstTime");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/predictAgainstTime");
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

	@GetMapping("/getActualPredictedForPlot")
	public String getActualPredictedForPlot() {
		log.info("GET: /process/getActualPredictedForPlot");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getActualPredictedForPlot");
	}

	@GetMapping("/getModelSummary")
	public String getModelSummary() {
		log.info("GET: /process/getModelSummary");
		GetURLContents getURLContents = new GetURLContents();
		String s = getURLContents.getData(flaskUrl + "/getModelSummary");
		return s;
	}

	@GetMapping("/getAccuracies")
	public String getAccuracies() {
		log.info("GET: /process/getAccuracies");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAccuracies");
	}

	@PostMapping("/sendTrainingSpecifics")
	public String sendTrainingSpecifics(@RequestBody Object trainingInputs) {
		this.trainingSpecifics = trainingInputs;
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/listenToTrainingInputs");
	}

	@GetMapping("/exchangeTrainingInputs")
	public Object exchangeTrainingSpecifics() {
		log.info("GET: /process/exchangeInput");
		return this.trainingSpecifics;
	}


	@GetMapping("/train")
	public String train() {
		log.info("GET: /process/train");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/train");
	}

}
