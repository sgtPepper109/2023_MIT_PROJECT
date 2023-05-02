package cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles_service;

import java.util.List;

import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles.MaxVehicles;
import cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles_repository.MaxVehiclesRepository;

@Service
public class MaxVehiclesService {
	
	private final MaxVehiclesRepository maxVehiclesRepository;

	public MaxVehiclesService(
			MaxVehiclesRepository maxVehiclesRepository) {
		this.maxVehiclesRepository = maxVehiclesRepository;
	}
	
	public MaxVehicles addRoadwayWidthMaxVehiclesMap(MaxVehicles maxVehicles) {
		return maxVehiclesRepository.save(maxVehicles);
	}
	
	public List<MaxVehicles> getAllRoadwayWidthMaxVehiclesMaps() {
		return maxVehiclesRepository.findAll();
	}
	
	public void truncateRoadwayWidthMaxVehiclesMaps() {
		maxVehiclesRepository.deleteAll();
	}
	
    public void update(Integer roadwayWidth, MaxVehicles maxVehicles) {
    	maxVehiclesRepository.delete(roadwayWidth);
    	this.maxVehiclesRepository.save(maxVehicles);
    }
    
    public void delete(Integer roadwayWidth) {
    	maxVehiclesRepository.delete(roadwayWidth);
    }

}
