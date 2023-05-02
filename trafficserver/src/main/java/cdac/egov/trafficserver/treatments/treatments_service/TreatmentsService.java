package cdac.egov.trafficserver.treatments.treatments_service;

import java.util.List;

import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.treatments.treatments.Treatments;
import cdac.egov.trafficserver.treatments.treatments_repository.TreatmentsRepository;

@Service
public class TreatmentsService {
	
	private final TreatmentsRepository treatmentsRepository;

	public TreatmentsService(TreatmentsRepository treatmentsRepository) {
		super();
		this.treatmentsRepository = treatmentsRepository;
	}
	
	public List<Treatments> getAllDistrictTreatmentCounts() { return treatmentsRepository.findAll(); }
	public Treatments addDistrictTreatmentCount(Treatments treatments) {
		return treatmentsRepository.save(treatments);
	}
	public List<Treatments> getDistrictInstances(String district, Integer startYear) { return treatmentsRepository.getDistrictInstancesWithStartTime(district, startYear); }
	public void deleteDistrictTreatmentCount(Treatments treatments) {
		treatmentsRepository.delete(treatments);
	}
	public void clearAllDistrictTreatmentCounts() { treatmentsRepository.deleteAll(); }
	public Treatments increaseDistrictTreatmentCount(String districtName, Integer startYear, Integer durationYears) {
		List<Treatments> existing = getDistrictInstances(districtName, startYear);
		Treatments firstTreatment = new Treatments();
		firstTreatment.setDistrictName(districtName);
		firstTreatment.setStartYear(startYear);
		firstTreatment.setDurationYears(durationYears);
		if (existing.isEmpty()) {
			firstTreatment.setNumberOfTreatmentRecommendations(1);
		} else {
			deleteDistrictTreatmentCount(existing.get(0));
			firstTreatment.setNumberOfTreatmentRecommendations(existing.get(0).getNumberOfTreatmentRecommendations() + 1);
		}
		return addDistrictTreatmentCount(firstTreatment);
	}
	public void decreaseDistrictTreatmentCounts(String districtName, Integer startYear) {
		List<Treatments> existing = getDistrictInstances(districtName, startYear);
		if (!existing.isEmpty()) {
			Treatments recordExisting = existing.get(0);
			deleteDistrictTreatmentCount(recordExisting);
			Integer currentNumberOfTreatments = recordExisting.getNumberOfTreatmentRecommendations();
			if (currentNumberOfTreatments != 1) {
				currentNumberOfTreatments --;
				recordExisting.setNumberOfTreatmentRecommendations(currentNumberOfTreatments);
				addDistrictTreatmentCount(recordExisting);
			}
		}
	}

}
