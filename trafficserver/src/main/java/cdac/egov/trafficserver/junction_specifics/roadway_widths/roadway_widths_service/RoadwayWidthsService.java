package cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths.RoadwayWidths;
import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths.RoadwayWidthsModel;
import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths_repository.RoadwayWidthsRepository;

@Service
public class RoadwayWidthsService {
	
	private final RoadwayWidthsRepository roadwayWidthsRepository;

	@Autowired
	public RoadwayWidthsService(RoadwayWidthsRepository roadwayWidthsRepository) {
		this.roadwayWidthsRepository = roadwayWidthsRepository;
	}

	public RoadwayWidths addJunctionRoadWayWidthMap(RoadwayWidthsModel roadwayWidthsModel) { return roadwayWidthsRepository.save(new RoadwayWidths(roadwayWidthsModel)); }
	public void truncateRedundantJunctionRoadwayWidthMaps() { roadwayWidthsRepository.deleteAll(); }
	public List<RoadwayWidths> getAllJunctionRoadwayWidthMaps() { return roadwayWidthsRepository.findAll(); }
    public void delete(String junction) { roadwayWidthsRepository.delete(junction); }
    public void update(String junction, RoadwayWidthsModel roadwayWidthsModel) {
    	roadwayWidthsRepository.delete(junction);
    	this.roadwayWidthsRepository.save(new RoadwayWidths(roadwayWidthsModel));
    }

}
