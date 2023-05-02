package cdac.egov.trafficserver.junction_specifics.junction_district.junction_district_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district.JunctionDistrict;
import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district.JunctionDistrictModel;
import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district_repository.JunctionDistrictRepository;

@Service
public class JunctionDistrictService {
	
	private final JunctionDistrictRepository junctionDistrictRepository;

	@Autowired
	public JunctionDistrictService(JunctionDistrictRepository junctionDistrictRepository) { this.junctionDistrictRepository = junctionDistrictRepository; }
	public void truncateRedundantJunctionDistrictMaps() { junctionDistrictRepository.deleteAll(); }
	public List<JunctionDistrict> getAllJunctionDistrictMaps() { return junctionDistrictRepository.findAll(); }
    public void delete(String junction) { junctionDistrictRepository.delete(junction); }
	public JunctionDistrict addJunctionDistrictMap(JunctionDistrictModel junctionDistrictModel) { 
		JunctionDistrict toAdd = new JunctionDistrict(junctionDistrictModel);
		return junctionDistrictRepository.save(toAdd);
	}
    public void update(String junction, JunctionDistrictModel junctionDistrictModel) {
    	JunctionDistrict toUpdate = new JunctionDistrict(junctionDistrictModel);
    	junctionDistrictRepository.delete(junction);
    	this.junctionDistrictRepository.save(toUpdate);
    }
	
}
