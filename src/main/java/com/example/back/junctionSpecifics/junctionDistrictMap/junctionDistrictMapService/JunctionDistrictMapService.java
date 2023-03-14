package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapRepository.JunctionDistrictMapRepository;

import javax.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JunctionDistrictMapService {
	
	private final JunctionDistrictMapRepository junctionDistrictMapRepository;

	@Autowired
	public JunctionDistrictMapService(JunctionDistrictMapRepository junctionDistrictMapRepository) {
		this.junctionDistrictMapRepository = junctionDistrictMapRepository;
	}
	
	public JunctionDistrictMap addJunctionDistrictMap(JunctionDistrictMap junctionDistrictMap) {
		return junctionDistrictMapRepository.save(junctionDistrictMap);
	}
	
	public void truncateRedundantJunctionDistrictMaps() {
		junctionDistrictMapRepository.deleteAll();
	}
	
	public List<JunctionDistrictMap> getAllJunctionDistrictMaps() {
		return junctionDistrictMapRepository.findAll();
	}
	

}
