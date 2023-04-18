package com.example.back.recommended.recommended;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Recommended implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private String junctionName;
	@Column(nullable = false)
	private String districtName;
	@Column(nullable = false)
	private Integer startYear;
	@Column(nullable = false)
	private Integer durationYears;

	public Recommended() {}

	@Override
	public String toString() {
		return "Recommended [id=" + id + ", junctionName=" + junctionName + ", districtName=" + districtName
				+ ", startYear=" + startYear + ", durationYears=" + durationYears + "]";
	}

	public Recommended(Long id, String junctionName, String districtName, Integer startYear, Integer durationYears) {
		super();
		this.id = id;
		this.junctionName = junctionName;
		this.districtName = districtName;
		this.startYear = startYear;
		this.durationYears = durationYears;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getJunctionName() {
		return junctionName;
	}

	public void setJunctionName(String junctionName) {
		this.junctionName = junctionName;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
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


}
