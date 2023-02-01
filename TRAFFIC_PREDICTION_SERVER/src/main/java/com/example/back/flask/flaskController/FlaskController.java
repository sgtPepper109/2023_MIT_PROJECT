package com.example.back.flask.flaskController;

import com.example.back.flask.getUrlContents.GetURLContents;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.hibernate.mapping.Any;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/process")
public class FlaskController {

    private Object csvData;

    @Value("${flask.url}")
    private String flaskUrl;

    public FlaskController() {}

    @GetMapping("/readData")
    public String getData() throws JsonProcessingException {
        System.out.println("localhost:8080/process/readData");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getTableData");
    }

    @GetMapping("/getPlot")
    public String getPlot() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getPlot");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/plot");
    }

    @GetMapping("/getPredicted/{junction_months}")
    public String predict(@PathVariable("junction_months") String junction_months) {
        System.out.println("localhost:8080/process/predicted/junction/months");
        GetURLContents getURLContents = new GetURLContents();
        String arr[] = junction_months.split("_");
        String junction = arr[0], months = arr[1];
        String path = flaskUrl + "/predict/" + junction + '/' + months;
        return getURLContents.getData(path);
    }

    @GetMapping("/setData")
    public String setData() throws JsonProcessingException {
        System.out.println("localhost:8080/process/setData");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/setData");
    }

//    @PostMapping(value = "/getCsvJson")
//    public List<?> getCsvJson(@RequestBody Object response) throws JsonProcessingException {
//        System.out.println("getCsvJson");
//        System.out.println(response);
//        List<String> l = new ArrayList<>();
//        l.add("hello");
//        l.add("hello2");
//        return l;
//    }

    @PostMapping("/setCsvData")
    public String getCsvData(@RequestBody Object response) throws JsonProcessingException {
        System.out.println("localhost:8080/process/csvData");
        this.csvData = response;
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getCsvData");
    }

    @GetMapping("/exchangeCsvData")
    public Object exhangeCsvData() throws JsonProcessingException {
        System.out.println("localhost:8080/process/exchangeCsvData");
        return this.csvData;
    }

    @GetMapping("/getResultTable")
    public String getResultTable() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getResultTable");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getResultTable");
    }

    @GetMapping("/getAccuracy")
    public String getAccuracy() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getAccuracy");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getAccuracy");
    }

    @GetMapping("/getActualPredicted")
    public String getActualPredicted() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getActualPredicted");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getActualPredicted");
    }

    @GetMapping("/getActualPredictedForPlot")
    public String getActualPredictedForPlot() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getActualPredictedForPlot");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData(flaskUrl + "/getActualPredictedForPlot");
    }

}
