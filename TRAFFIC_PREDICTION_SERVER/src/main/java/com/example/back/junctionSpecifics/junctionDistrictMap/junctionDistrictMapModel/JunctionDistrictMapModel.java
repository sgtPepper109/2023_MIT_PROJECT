package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapModel;

import java.io.Serializable;

import jakarta.persistence.*;

public class JunctionDistrictMapModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
	private Long id;
    @Column(nullable=false)
	private Long junctionId;
	private String junctionName;
	@Column(nullable=false)
	private Long districtId;
	private String districtName;
	
	public JunctionDistrictMapModel() {}
	public JunctionDistrictMapModel(Long id, Long junctionId, String junctionName, Long districtId, String districtName) {
		this.id = id;
		this.junctionId = junctionId;
		this.junctionName = junctionName;
		this.districtId = districtId;
		this.districtName = districtName;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getJunctionId() {
		return junctionId;
	}

	public void setJunctionId(Long junctionId) {
		this.junctionId = junctionId;
	}

	public String getJunctionName() {
		return junctionName;
	}

	public void setJunctionName(String junctionName) {
		this.junctionName = junctionName;
	}

	public Long getDistrictId() {
		return districtId;
	}

	public void setDistrictId(Long districtId) {
		this.districtId = districtId;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	@Override
	public String toString() {
		return "JunctionDistrictMap [id=" + id + ", junctionId=" + junctionId + ", junctionName=" + junctionName
				+ ", districtId=" + districtId + ", districtName=" + districtName + "]";
	}

}
