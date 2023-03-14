package com.example.back.junctionSpecifics.districts.districts;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Districts {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String name;
	private Integer parent_id;
	private Integer external_id;
	private String location_type;
	private String pin;
	
	public Districts() {}

	public Districts(Integer id, String name, Integer parent_id, Integer external_id, String location_type,
			String pin) {
		this.id = id;
		this.name = name;
		this.parent_id = parent_id;
		this.external_id = external_id;
		this.location_type = location_type;
		this.pin = pin;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getParent_id() {
		return parent_id;
	}

	public void setParent_id(Integer parent_id) {
		this.parent_id = parent_id;
	}

	public Integer getExternal_id() {
		return external_id;
	}

	public void setExternal_id(Integer external_id) {
		this.external_id = external_id;
	}

	public String getLocation_type() {
		return location_type;
	}

	public void setLocation_type(String location_type) {
		this.location_type = location_type;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

	@Override
	public String toString() {
		return "districts [id=" + id + ", name=" + name + ", parent_id=" + parent_id + ", external_id=" + external_id
				+ ", location_type=" + location_type + ", pin=" + pin + "]";
	}
}
