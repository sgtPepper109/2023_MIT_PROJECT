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

	public Recommended addRecommended(Recommended recommended) { return recommendedRepository.save(recommended); }
	public void clearAllRecommended() { recommendedRepository.deleteAll(); }
	public void deleteRecommendation(Recommended recommended) { recommendedRepository.delete(recommended); }
	public void deleteById(Long id) { recommendedRepository.deleteById(id); }
	public List<Recommended> getAllRecommended() { return recommendedRepository.findAll(); }
	public List<Recommended> getJunctionInstances(String junction) { return recommendedRepository.getJunctionInstances(junction); }
	public List<Recommended> getJunctionWithStartYear(String junction, Integer startYear) {
		return recommendedRepository.getJunctionWithStartYear(junction, startYear);
	}
	public List<Recommended> getDistrictInstancesWithStartYear(String district, Integer startYear) {
		return recommendedRepository.getDistrictInstancesWithStartYear(district, startYear);
	}

}
