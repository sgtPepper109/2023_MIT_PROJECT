package cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths_repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cdac.egov.trafficserver.junction_specifics.roadway_widths.roadway_widths.RoadwayWidths;

@Transactional
public interface RoadwayWidthsRepository extends JpaRepository<RoadwayWidths, Long> {
	
	@Modifying
	@Query("delete from RoadwayWidths j where j.junctionName = :junction")
	void delete(@Param("junction") String junction);
	
}
