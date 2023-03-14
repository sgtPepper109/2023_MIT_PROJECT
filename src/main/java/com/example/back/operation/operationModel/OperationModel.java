package com.example.trafficsvr.operation.operationModel;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class OperationModel implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// This is the structure of Operation class that will be reflected into the database
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String dataset;
    @Column(nullable=false)
    private Float trainRatio;
    @Column(nullable=false)
    private Float testRatio;

    // The userId will be linked to the id of the user in users table when logged in
    // The users table will be made later
    @Column(nullable = false, updatable = false)
    private Long userId;

    public OperationModel() {}
    public OperationModel(Long id, String dataset, Float trainRatio, Float testRatio, Long userId) {
        this.id = id;
        this.dataset = dataset;
        this.trainRatio = trainRatio;
        this.testRatio = testRatio;
        this.userId = userId;
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

    public Float getTrainRatio() {
        return trainRatio;
    }

    public void setTrainRatio(Float trainRatio) {
        this.trainRatio = trainRatio;
    }

    public Float getTestRatio() {
        return testRatio;
    }

    public void setTestRatio(Float testRatio) {
        this.testRatio = testRatio;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Operation{" +
                "id=" + id + '\'' +
                ", dataset='" + dataset + '\'' +
                ", trainRatio='" + trainRatio + '\'' +
                ", testRatio='" + testRatio + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
    
    public static void main(String[] args) {
    	
    }
}
