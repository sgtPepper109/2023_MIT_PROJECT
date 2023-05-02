package com.example.back.treatments.treatments;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Treatments implements Serializable {
	

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private String districtName;
	@Column(nullable = false)
	private Integer numberOfTreatmentRecommendations;
	@Column(nullable = false)
	private Integer startYear;
	@Column(nullable = false)
	private Integer durationYears;
	
	public Treatments() {}

	public Treatments(Long id, String districtName, Integer numberOfTreatmentRecommendations,
			Integer startYear, Integer durationYears) {
		super();
		this.id = id;
		this.districtName = districtName;
		this.numberOfTreatmentRecommendations = numberOfTreatmentRecommendations;
		this.startYear = startYear;
		this.durationYears = durationYears;
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

	public Integer getStartYear() {
		return startYear;
	}

	public void setStartYear(Integer startYear) {
		this.startYear = startYear;
	}

	public Integer getDurationYears() {
		return durationYears;
	}

	public void setDurationYears(Integer durationYears) {
		this.durationYears = durationYears;
	}

	@Override
	public String toString() {
		return "DistrictTreatmentCount [id=" + id + ", districtName=" + districtName
				+ ", numberOfTreatmentRecommendations=" + numberOfTreatmentRecommendations + ", startYear=" + startYear
				+ ", durationYears=" + durationYears + "]";
	}
	
}
