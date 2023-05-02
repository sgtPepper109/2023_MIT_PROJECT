package cdac.egov.trafficserver.csv_instance.csv_instance_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.csv_instance.csv_instance.CsvInstance;
import cdac.egov.trafficserver.csv_instance.csv_instance_repository.CsvInstanceRepository;

@Service
public class CsvInstanceService {
	
	private final CsvInstanceRepository csvInstanceRepository;

	@Autowired
	public CsvInstanceService(CsvInstanceRepository csvInstanceRepository) {
		super();
		this.csvInstanceRepository = csvInstanceRepository;
	}
	
	public List<CsvInstance> addCsvInstances(List<CsvInstance> csvInstances) {
		return csvInstanceRepository.saveAll(csvInstances);
	}
	
	public List<CsvInstance> getCsvInstances() {
		return csvInstanceRepository.findAll();
	}
	
	public void deleteJunctionData(String junction) {
		csvInstanceRepository.deleteJunctionData(junction);
	}
	
	public List<CsvInstance> getJunctionData(String junction) {
		return csvInstanceRepository.getJunctionData(junction);
	}

}
