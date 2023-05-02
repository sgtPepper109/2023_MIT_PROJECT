package cdac.egov.trafficserver.junction_specifics.junction_district.junction_district;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class JunctionDistrict implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable=false)
	private String junctionName;
	@Column(nullable=false)
	private String district;
	
	public JunctionDistrict() {}

	public JunctionDistrict(Long id, String junctionName, String district) {
		this.id = id;
		this.junctionName = junctionName;
		this.district = district;
	}
	
	public JunctionDistrict(JunctionDistrictModel junctionDistrictModel) {
		this.id = junctionDistrictModel.id;
		this.junctionName = junctionDistrictModel.junctionName;
		this.district = junctionDistrictModel.district;
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
