package com.example.back.junction_specifics.roadway_widths.roadway_widths_service;

import com.example.back.junction_specifics.roadway_widths.roadway_widths.RoadwayWidths;
import com.example.back.junction_specifics.roadway_widths.roadway_widths_repository.RoadwayWidthsRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoadwayWidthsService {
	
	private final RoadwayWidthsRepository roadwayWidthsRepository;

	@Autowired
	public RoadwayWidthsService(RoadwayWidthsRepository roadwayWidthsRepository) {
		this.roadwayWidthsRepository = roadwayWidthsRepository;
	}

	public RoadwayWidths addJunctionRoadWayWidthMap(RoadwayWidths roadwayWidths) {
		return roadwayWidthsRepository.save(roadwayWidths);
	}
	
	public void truncateRedundantJunctionRoadwayWidthMaps() {
		roadwayWidthsRepository.deleteAll();
	}
	
	public List<RoadwayWidths> getAllJunctionRoadwayWidthMaps() {
		return roadwayWidthsRepository.findAll();
	}

    public void update(String junction, RoadwayWidths roadwayWidths) {
    	roadwayWidthsRepository.delete(junction);
    	this.roadwayWidthsRepository.save(roadwayWidths);
    }
    
    public void delete(String junction) {
    	roadwayWidthsRepository.delete(junction);
    }

}
