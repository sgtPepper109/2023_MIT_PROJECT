package com.example.back.junction_specifics.junction_district.junction_district_service;

import com.example.back.junction_specifics.junction_district.junction_district.JunctionDistrict;
import com.example.back.junction_specifics.junction_district.junction_district_repository.JunctionDistrictRepository;

import javax.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JunctionDistrictService {
	
	private final JunctionDistrictRepository junctionDistrictRepository;

	@Autowired
	public JunctionDistrictService(JunctionDistrictRepository junctionDistrictRepository) {
		this.junctionDistrictRepository = junctionDistrictRepository;
	}
	
	public JunctionDistrict addJunctionDistrictMap(JunctionDistrict junctionDistrict) {
		return junctionDistrictRepository.save(junctionDistrict);
	}
	
	public void truncateRedundantJunctionDistrictMaps() {
		junctionDistrictRepository.deleteAll();
	}
	
	public List<JunctionDistrict> getAllJunctionDistrictMaps() {
		return junctionDistrictRepository.findAll();
	}
	
    public void update(String junction, JunctionDistrict junctionDistrict) {
    	junctionDistrictRepository.delete(junction);
    	this.junctionDistrictRepository.save(junctionDistrict);
    }
    
    public void delete(String junction) {
    	junctionDistrictRepository.delete(junction);
    }
	
}
