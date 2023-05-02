package cdac.egov.trafficserver.junction_specifics.pcu.pcu;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Pcu implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private Integer roadwayWidth;
	@Column(nullable = false)
	private Integer maxPcu;
	
	public Pcu() {}

	public Pcu(Long id, Integer roadwayWidth, Integer maxVehicles) {
		this.id = id;
		this.roadwayWidth = roadwayWidth;
		this.maxPcu = maxVehicles;
	}
	
	public Pcu(PcuModel pcuModel) {
		this.id = pcuModel.id;
		this.roadwayWidth = pcuModel.roadwayWidth;
		this.maxPcu = pcuModel.maxPcu;
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
		return maxPcu;
	}

	public void setMaxVehicles(Integer maxVehicles) {
		this.maxPcu = maxVehicles;
	}

	@Override
	public String toString() {
		return "RoadwayWidthMaxVehiclesMap [id=" + id + ", roadwayWidth=" + roadwayWidth + ", maxVehicles="
				+ maxPcu + "]";
	}
	
	
	
}
