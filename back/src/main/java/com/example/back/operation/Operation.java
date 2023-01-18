package com.example.back.operation;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class Operation implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String dataset;
    private Float trainratio;
    private Float testratio;
    private Float valratio;

    @Column(nullable = false, updatable = false)
    private Long user_id;

    public Operation() {}
    public Operation(Long id, String dataset, Float trainratio, Float testratio, Float valratio, Long user_id) {
        this.id = id;
        this.dataset = dataset;
        this.trainratio = trainratio;
        this.testratio = testratio;
        this.valratio = valratio;
        this.user_id = user_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public Float getTrainratio() {
        return trainratio;
    }

    public void setTrainratio(Float trainratio) {
        this.trainratio = trainratio;
    }

    public Float getTestratio() {
        return testratio;
    }

    public void setTestratio(Float testratio) {
        this.testratio = testratio;
    }

    public Float getValratio() {
        return valratio;
    }

    public void setValratio(Float valratio) {
        this.valratio = valratio;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    @Override
    public String toString() {
        return "Operation{" +
                "id=" + id + '\'' +
                ", dataset='" + dataset + '\'' +
                ", trainratio='" + trainratio + '\'' +
                ", testratio='" + testratio + '\'' +
                ", valratio='" + valratio + '\'' +
                ", user_id='" + user_id + '\'' +
                '}';
    }
}
