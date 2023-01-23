package com.example.back.predictionDetails;

public class PredictionDetails {
    private String junction;
    private String months;

    public PredictionDetails() {}

    public PredictionDetails(String junction, String months) {
        this.junction = junction;
        this.months = months;
    }

    public String getJunction() {
        return junction;
    }

    public void setJunction(String junction) {
        this.junction = junction;
    }

    public String getMonths() {
        return months;
    }

    public void setMonths(String months) {
        this.months = months;
    }
}
