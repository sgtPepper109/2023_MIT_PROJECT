package cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles_repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cdac.egov.trafficserver.junction_specifics.max_vehicles.max_vehicles.MaxVehicles;

@Transactional
public interface MaxVehiclesRepository extends JpaRepository<MaxVehicles, Long> {
	
	@Modifying
	@Query("delete from MaxVehicles r where r.roadwayWidth= :roadwayWidth")
	void delete(@Param("roadwayWidth") Integer roadwayWidth);
	
}
