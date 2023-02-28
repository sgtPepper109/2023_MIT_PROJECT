package com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapService;

import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMap.JunctionRoadwayWidthMap;
import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapRepository.JunctionRoadwayWidthMapRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JunctionRoadwayWidthMapService {
	
	private final JunctionRoadwayWidthMapRepository junctionRoadwayWidthMapRepository;

	@Autowired
	public JunctionRoadwayWidthMapService(JunctionRoadwayWidthMapRepository junctionRoadwayWidthMapRepository) {
		this.junctionRoadwayWidthMapRepository = junctionRoadwayWidthMapRepository;
	}

	public JunctionRoadwayWidthMap addJunctionRoadWayWidthMap(JunctionRoadwayWidthMap junctionRoadwayWidthMap) {
		return junctionRoadwayWidthMapRepository.save(junctionRoadwayWidthMap);
	}
	
	public void truncateRedundantJunctionRoadwayWidthMaps() {
		junctionRoadwayWidthMapRepository.deleteAll();
	}
	
	public List<JunctionRoadwayWidthMap> getAllJunctionRoadwayWidthMaps() {
		return junctionRoadwayWidthMapRepository.findAll();
	}

}
