package com.example.back.districtTreatmentCount.districtTreatmentCount;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class DistrictTreatmentCount implements Serializable {
	

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private String districtName;
	@Column(nullable = false)
	private Integer numberOfTreatmentRecommendations;
	
	public DistrictTreatmentCount() {}
	
	public DistrictTreatmentCount(Long id, String districtName, Integer numberOfTreatmentRecommendations) {
		super();
		this.id = id;
		this.districtName = districtName;
		this.numberOfTreatmentRecommendations = numberOfTreatmentRecommendations;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	public Integer getNumberOfTreatmentRecommendations() {
		return numberOfTreatmentRecommendations;
	}

	public void setNumberOfTreatmentRecommendations(Integer numberOfTreatmentRecommendations) {
		this.numberOfTreatmentRecommendations = numberOfTreatmentRecommendations;
	}

	@Override
	public String toString() {
		return "DistrictTreatmentCount [id=" + id + ", districtName=" + districtName
				+ ", numberOfTreatmentRecommendations=" + numberOfTreatmentRecommendations + "]";
	}
	
	

}
