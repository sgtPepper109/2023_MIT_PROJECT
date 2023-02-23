package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapService;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapRepository.JunctionDistrictMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
		junctionDistrictMapRepository.truncateRedundantJunctionDistrictMaps();
	}
	

}
