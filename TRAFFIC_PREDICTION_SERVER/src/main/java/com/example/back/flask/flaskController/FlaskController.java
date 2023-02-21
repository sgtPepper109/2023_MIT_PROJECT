package com.example.back.flask.flaskController;

import com.example.back.flask.getUrlContents.GetURLContents;

import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/process")
public class FlaskController {

    private Object csvData;
    private Object input;
    

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(FlaskController.class);

    @Value("${flask.url}")
    private String flaskUrl;

    public FlaskController() { /* NOTE: Document why this method is empty */ }

    @GetMapping("/readData")
    public String getData() {
        log.info("GET: localhost:8080/process/readData");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getTableData");
    }

    @GetMapping("/getPlot")
    public String getPlot() {
        log.info("GET: localhost:8080/process/getPlot");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/plot");
    }
    
    @PostMapping("/input")
    public String getInput(@RequestBody Object response) {
        log.warn("POST: localhost:8080/process/input");
    	this.input = response;
    	GetURLContents getURLContents = new GetURLContents();
    	return getURLContents.getData(flaskUrl + "/input");
    }

    @GetMapping("/getPredicted")
    public String predict() {
        log.info("GET: localhost:8080/process/getPredicted");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/predict");
    }

    @GetMapping("/setData")
    public String setData() {
        log.info("GET: localhost:8080/process/setData");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/setData");
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
        log.info("GET: localhost:8080/process/exchangeCsvData");
        return this.csvData;
    }
    
    @GetMapping("/exchangeInput")
    public Object exchangeInput() {
        log.info("GET: localhost:8080/process/exchangeInput");
    	return this.input;
    }

    @GetMapping("/getResultTable")
    public String getResultTable() {
        log.info("GET: localhost:8080/process/getResultTable");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getResultTable");
    }

    @GetMapping("/getAccuracy")
    public String getAccuracy() {
        log.info("GET: localhost:8080/process/getAccuracy");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getAccuracy");
    }

    @GetMapping("/getActualPredicted")
    public String getActualPredicted() {
        log.info("GET: localhost:8080/process/getActualPredicted");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getActualPredicted");
    }

    @GetMapping("/getActualPredictedForPlot")
    public String getActualPredictedForPlot() {
        log.info("GET: localhost:8080/process/getActualPredictedForPlot");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getActualPredictedForPlot");
    }
    
    @GetMapping("/getModelSummary")
    public String getModelSummary() {
        log.info("GET: localhost:8080/process/getModelSummary");
    	GetURLContents getURLContents = new GetURLContents();
    	return getURLContents.getData(flaskUrl + "/getModelSummary"); 
    }
    
    @GetMapping("/getAllJunctions")
    public String getAllJunctions() {
    	log.info("GET: localhost:8080/process/getAllJunctions");
    	GetURLContents getURLContents = new GetURLContents();
    	return getURLContents.getData(flaskUrl + "/getAllJunctions"); 
    }
    
    @GetMapping("/getAccuracies")
    public String getAccuracies() {
    	log.info("GET: localhost:8080/process/getAccuracies");
    	GetURLContents getURLContents = new GetURLContents();
    	return getURLContents.getData(flaskUrl + "/getAccuracies"); 
    }

}
