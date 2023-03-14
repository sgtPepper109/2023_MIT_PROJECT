package com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapService;

import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMap.RoadwayWidthMaxVehiclesMap;
import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapRepository.RoadwayWidthMaxVehiclesMapRepository;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoadwayWidthMaxVehiclesMapService {
	
	private final RoadwayWidthMaxVehiclesMapRepository roadwayWidthMaxVehiclesMapRepository;

	public RoadwayWidthMaxVehiclesMapService(
			RoadwayWidthMaxVehiclesMapRepository roadwayWidthMaxVehiclesMapRepository) {
		this.roadwayWidthMaxVehiclesMapRepository = roadwayWidthMaxVehiclesMapRepository;
	}
	
	public RoadwayWidthMaxVehiclesMap addRoadwayWidthMaxVehiclesMap(RoadwayWidthMaxVehiclesMap roadwayWidthMaxVehiclesMap) {
		return roadwayWidthMaxVehiclesMapRepository.save(roadwayWidthMaxVehiclesMap);
	}
	
	public List<RoadwayWidthMaxVehiclesMap> getAllRoadwayWidthMaxVehiclesMaps() {
		return roadwayWidthMaxVehiclesMapRepository.findAll();
	}
	
	public void truncateRoadwayWidthMaxVehiclesMaps() {
		roadwayWidthMaxVehiclesMapRepository.deleteAll();
	}

}
