package com.example.back.treatments.treatments_service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.treatments.treatments.Treatments;
import com.example.back.treatments.treatments_repository.TreatmentsRepository;

@Service
public class TreatmentsService {
	
	private TreatmentsRepository treatmentsRepository;

	public TreatmentsService(TreatmentsRepository treatmentsRepository) {
		super();
		this.treatmentsRepository = treatmentsRepository;
	}
	
	public List<Treatments> getAllDistrictTreamentCounts() { return treatmentsRepository.findAll(); }
	public Treatments addDistrictTreatmentCount(Treatments treatments) {
		return treatmentsRepository.save(treatments);
	}
	public List<Treatments> getDistrictInstances(String district, Integer startYear) { return treatmentsRepository.getDistrictInstancesWithStartTime(district, startYear); }
	public void deleteDistrictTreatmentCount(Treatments treatments) {
		treatmentsRepository.delete(treatments);
	}
	public void clearAllDistrictTreatmentCounts() { treatmentsRepository.deleteAll(); }

}
