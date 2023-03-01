package com.example.back.junctionSpecifics.roadwayWidths.roadwayWidthsService;

import com.example.back.junctionSpecifics.roadwayWidths.roadwayWidths.RoadwayWidths;
import com.example.back.junctionSpecifics.roadwayWidths.roadwayWidthsRepository.RoadwayWidthsRepository;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoadwayWidthsService {

	private final RoadwayWidthsRepository roadwayWidthsRepository;

	public RoadwayWidthsService(RoadwayWidthsRepository roadwayWidthsRepository) {
		this.roadwayWidthsRepository = roadwayWidthsRepository;
	}
	
	public List<RoadwayWidths> getAllRoadwayWidths() {
		return roadwayWidthsRepository.findAll();
	}
	
}
