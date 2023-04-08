package com.example.back.recommended.recommendedService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.back.recommended.recommended.Recommended;
import com.example.back.recommended.recommendedRepository.RecommendedRepository;

@Service
public class RecommendedService {
	
	private final RecommendedRepository recommendedRepository;

	@Autowired
	public RecommendedService(RecommendedRepository recommendedRepository) {
		super();
		this.recommendedRepository = recommendedRepository;
	}

	public List<Recommended> getAllRecommended() { return recommendedRepository.findAll(); }
	public Recommended addRecommended(Recommended recommended) { return recommendedRepository.save(recommended); }
	public List<Recommended> getJunctionInstances(String junction) { return recommendedRepository.getJunctionInstances(junction); }

}
