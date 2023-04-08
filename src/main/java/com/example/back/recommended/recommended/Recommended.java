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

	public Recommended() {}

	public Recommended(Long id, String junctionName, String districtName) {
		super();
		this.id = id;
		this.junctionName = junctionName;
		this.districtName = districtName;
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

	@Override
	public String toString() {
		return "Recommended [id=" + id + ", junctionName=" + junctionName + ", districtName=" + districtName + "]";
	}
	
	
	
	

}
