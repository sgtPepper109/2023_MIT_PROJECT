package com.example.back.csv_instance.csv_instance;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class CsvInstance implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	private String dateTime;
	private String junction;
	private Integer vehicles;
	
	public CsvInstance() {}

	public CsvInstance(Long id, String dateTime, String junction, Integer vehicles) {
		super();
		this.id = id;
		this.dateTime = dateTime;
		this.junction = junction;
		this.vehicles = vehicles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public String getJunction() {
		return junction;
	}

	public void setJunction(String junction) {
		this.junction = junction;
	}

	public Integer getVehicles() {
		return vehicles;
	}

	public void setVehicles(Integer vehicles) {
		this.vehicles = vehicles;
	}

	@Override
	public String toString() {
		return "CsvInstance [id=" + id + ", dateTime=" + dateTime + ", junction=" + junction + ", vehicles=" + vehicles
				+ "]";
	}
	
	
	
}
