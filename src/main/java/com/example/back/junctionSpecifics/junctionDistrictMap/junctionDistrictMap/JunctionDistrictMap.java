package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class JunctionDistrictMap implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable=false)
	private String junctionName;
	@Column(nullable=false)
	private String district;
	
	public JunctionDistrictMap() {}

	public JunctionDistrictMap(Long id, String junctionName, String district) {
		this.id = id;
		this.junctionName = junctionName;
		this.district = district;
	}

	@Override
	public String toString() {
		return "JunctionDistrictMap [id=" + id + ", junctionName=" + junctionName + ", district=" + district + "]";
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

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

}
