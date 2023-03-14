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

	@GetMapping("/revealPredictions")
	public String revealPredictions() {
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/revealPredictions");
	}

	@GetMapping("/readData")
	public String getData() {
		log.info("GET: /process/readData");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getTableData");
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
	
	@PostMapping("/input")
	public String getInput(@RequestBody Object response) {
		log.warn("POST: localhost:8080/process/input");
		this.input = response;
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/input");
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

	@GetMapping("/getPredicted")
	public String predict() {
		log.info("GET: /process/getPredicted");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/predict");
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

	@GetMapping("/setData")
	public String setData() {
		log.info("GET: /process/setData");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/setData");
	}

	@PostMapping("/setCsvData")
	public String getCsvData(@RequestBody Object response) {
		System.out.println("response " + response);
		System.out.println("PostMapping");
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

	@GetMapping("/exchangeInput")
	public Object exchangeInput() {
		log.info("GET: /process/exchangeInput");
		return this.input;
	}

	@GetMapping("/getResultTable")
	public String getResultTable() {
		log.info("GET: /process/getResultTable");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getResultTable");
	}

	@GetMapping("/getAccuracy")
	public String getAccuracy() {
		log.info("GET: /process/getAccuracy");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAccuracy");
	}

	@GetMapping("/getActualPredicted")
	public String getActualPredicted() {
		log.info("GET: /process/getActualPredicted");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getActualPredicted");
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
		return getURLContents.getData(flaskUrl + "/getModelSummary");
	}

	@GetMapping("/getAllJunctions")
	public String getAllJunctions() {
		log.info("GET: /process/getAllJunctions");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctions");
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

	@GetMapping("/getAllJunctionsAccuracies")
	public String getAllJunctionsAccuracies() {
		log.info("GET: /process/getAllJunctionsAccuracies");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctionsAccuracies");
	}

	@GetMapping("/getAllJunctionsAccuracyScore")
	public String getAllJunctionsAccuracyScore() {
		log.info("GET: /process/getAllJunctionsAccuracyScore");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctionsAccuracyScore");
	}

	@GetMapping("/getAllJunctionsPredictedTableData")
	public String getPredictedTableData() {
		log.info("GET: /process/getPredictedTableData");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctionsPredictedTableData");
	}

	@GetMapping("/getAllJunctionsPlotData")
	public String getAllJunctionsPlotData() {
		log.info("GET: /process/getAllJunctionsPlotData");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/getAllJunctionsPlotData");
	}
	
	
	@GetMapping("/train")
	public String train() {
		log.info("GET: /process/train");
		GetURLContents getURLContents = new GetURLContents();
		return getURLContents.getData(flaskUrl + "/train");
	}

}