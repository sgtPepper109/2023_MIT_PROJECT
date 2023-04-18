package com.example.back.districtTreatmentCount.districtTreatmentCountService;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.districtTreatmentCount.districtTreatmentCount.DistrictTreatmentCount;
import com.example.back.districtTreatmentCount.districtTreatmentCountRepository.DistrictTreatmentCountRepository;

@Service
public class DistrictTreatmentCountService {
	
	private DistrictTreatmentCountRepository districtTreatmentCountRepository;

	public DistrictTreatmentCountService(DistrictTreatmentCountRepository districtTreatmentCountRepository) {
		super();
		this.districtTreatmentCountRepository = districtTreatmentCountRepository;
	}
	
	public List<DistrictTreatmentCount> getAllDistrictTreamentCounts() { return districtTreatmentCountRepository.findAll(); }
	public DistrictTreatmentCount addDistrictTreatmentCount(DistrictTreatmentCount districtTreatmentCount) {
		return districtTreatmentCountRepository.save(districtTreatmentCount);
	}
	public List<DistrictTreatmentCount> getDistrictInstances(String district) { return districtTreatmentCountRepository.getDistrictInstances(district); }
	public void deleteDistrictTreatmentCount(DistrictTreatmentCount districtTreatmentCount) {
		districtTreatmentCountRepository.delete(districtTreatmentCount);
	}
	public void clearAllDistrictTreatmentCounts() { districtTreatmentCountRepository.deleteAll(); }

}
