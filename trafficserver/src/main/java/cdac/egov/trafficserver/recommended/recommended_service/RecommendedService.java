package cdac.egov.trafficserver.recommended.recommended_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.recommended.recommended.Recommended;
import cdac.egov.trafficserver.recommended.recommended.RecommendedModel;
import cdac.egov.trafficserver.recommended.recommended_repository.RecommendedRepository;

@Service
public class RecommendedService {
	
	private final RecommendedRepository recommendedRepository;

	@Autowired
	public RecommendedService(RecommendedRepository recommendedRepository) {
		super();
		this.recommendedRepository = recommendedRepository;
	}

	public Recommended addRecommended(RecommendedModel recommendedModel) { return recommendedRepository.save(new Recommended(recommendedModel)); }
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
