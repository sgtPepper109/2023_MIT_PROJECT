package com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMap;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class JunctionMaxVehiclesMap implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private String junctionName;
	@Column(nullable = false)
	private float maxVehicles;
	
	public JunctionMaxVehiclesMap() {}

	public JunctionMaxVehiclesMap(Long id, String junctionName, float maxVehicles) {
		this.id = id;
		this.junctionName = junctionName;
		this.maxVehicles = maxVehicles;
	}

	@Override
	public String toString() {
		return "JunctionMaxVehiclesMap [id=" + id + ", junctionName=" + junctionName + ", maxVehicles=" + maxVehicles + "]";
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

	public float getmaxVehicles() {
		return maxVehicles;
	}

	public void setmaxVehicles(float maxVehicles) {
		this.maxVehicles = maxVehicles;
	}

}
