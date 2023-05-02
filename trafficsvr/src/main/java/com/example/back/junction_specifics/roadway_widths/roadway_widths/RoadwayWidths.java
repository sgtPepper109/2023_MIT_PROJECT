package com.example.back.junction_specifics.roadway_widths.roadway_widths;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class RoadwayWidths implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
	private Long id;
    @Column(nullable=false)
	private String junctionName;
	@Column(nullable=false)
	private float roadwayWidth;
    
    public RoadwayWidths(Long id, String junctionName, float roadwayWidth) {
		this.id = id;
		this.junctionName = junctionName;
		this.roadwayWidth = roadwayWidth;
	}

	@Override
	public String toString() {
		return "JunctionRoadwayWidthMap [id=" + id + ", junctionName=" + junctionName + ", roadwayWidth=" + roadwayWidth
				+ "]";
	}

	public RoadwayWidths() {}
    
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
	public float getroadwayWidth() {
		return roadwayWidth;
	}
	public void setroadwayWidth(float roadwayWidth) {
		this.roadwayWidth = roadwayWidth;
	}
	
}
