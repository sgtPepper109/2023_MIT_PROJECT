package cdac.egov.trafficserver.junction_specifics.districts.districts;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Districts {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String name;
	private Integer parentId;
	private Integer externalId;
	private String locationType;
	private String pin;
	
	public Districts() {}

	public Districts(Integer id, String name, Integer parentId, Integer externalId, String locationType,
			String pin) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		this.externalId = externalId;
		this.locationType = locationType;
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

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public Integer getExternalId() {
		return externalId;
	}

	public void setExternalId(Integer externalId) {
		this.externalId = externalId;
	}

	public String getLocationType() {
		return locationType;
	}

	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

	@Override
	public String toString() {
		return "districts [id=" + id + ", name=" + name + ", parentId=" + parentId + ", externalId=" + externalId
				+ ", locationType=" + locationType + ", pin=" + pin + "]";
	}
}
