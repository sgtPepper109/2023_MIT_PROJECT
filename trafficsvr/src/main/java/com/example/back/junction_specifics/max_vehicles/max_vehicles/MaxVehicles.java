package com.example.back.junction_specifics.max_vehicles.max_vehicles;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class MaxVehicles implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private Integer roadwayWidth;
	@Column(nullable = false)
	private Integer maxVehicles;
	
	public MaxVehicles() {}

	public MaxVehicles(Long id, Integer roadwayWidth, Integer maxVehicles) {
		this.id = id;
		this.roadwayWidth = roadwayWidth;
		this.maxVehicles = maxVehicles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getRoadwayWidth() {
		return roadwayWidth;
	}

	public void setRoadwayWidth(Integer roadwayWidth) {
		this.roadwayWidth = roadwayWidth;
	}

	public Integer getMaxVehicles() {
		return maxVehicles;
	}

	public void setMaxVehicles(Integer maxVehicles) {
		this.maxVehicles = maxVehicles;
	}

	@Override
	public String toString() {
		return "RoadwayWidthMaxVehiclesMap [id=" + id + ", roadwayWidth=" + roadwayWidth + ", maxVehicles="
				+ maxVehicles + "]";
	}
	
	
	
}
