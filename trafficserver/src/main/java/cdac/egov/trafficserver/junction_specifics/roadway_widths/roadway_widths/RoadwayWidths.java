package cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
    
    public RoadwayWidths(RoadwayWidthsModel roadwayWidthsModel) {
		this.id = roadwayWidthsModel.id;
		this.junctionName = roadwayWidthsModel.junctionName;
		this.roadwayWidth = roadwayWidthsModel.roadwayWidth;
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
	public float getRoadwayWidth() {
		return roadwayWidth;
	}
	public void setRoadwayWidth(float roadwayWidth) {
		this.roadwayWidth = roadwayWidth;
	}
	
}
