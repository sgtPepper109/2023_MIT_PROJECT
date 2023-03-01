package com.example.back.junctionSpecifics.roadwayWidths.roadwayWidths;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class RoadwayWidths implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Integer roadway_width;
	
	public RoadwayWidths() {}

	public RoadwayWidths(Integer id, Integer roadway_width) {
		this.id = id;
		this.roadway_width = roadway_width;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRoadway_width() {
		return roadway_width;
	}

	public void setRoadway_width(Integer roadway_width) {
		this.roadway_width = roadway_width;
	}

	@Override
	public String toString() {
		return "RoadwayWidths [id=" + id + ", roadway_width=" + roadway_width + "]";
	}
	
}
