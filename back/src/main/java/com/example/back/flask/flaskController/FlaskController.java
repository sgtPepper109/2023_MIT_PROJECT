package com.example.back.flask.flaskController;

import com.example.back.flask.getUrlContents.GetURLContents;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/process")
public class FlaskController {

    public FlaskController() {}

    @GetMapping("/readData")
    public String getData() throws JsonProcessingException {
        System.out.println("localhost:8080/process/readData");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData("http://localhost:5000/data");
    }

    @GetMapping("/getPlot")
    public String getPlot() throws JsonProcessingException {
        System.out.println("localhost:8080/process/getPlot");
        GetURLContents getURLContents = new GetURLContents();
        return getURLContents.getData("http://localhost:5000/plot");
    }

    @GetMapping("/getPredicted/{junction_months}")
    public String predict(@PathVariable("junction_months") String junction_months) {
        System.out.println("localhost:8080/process/predicted/junction/months");
        GetURLContents getURLContents = new GetURLContents();
        String arr[] = junction_months.split("_");
        String junction = arr[0], months = arr[1];
        String path = "http://localhost:5000/predict/" + junction + '/' + months;
        return getURLContents.getData(path);
    }

}
