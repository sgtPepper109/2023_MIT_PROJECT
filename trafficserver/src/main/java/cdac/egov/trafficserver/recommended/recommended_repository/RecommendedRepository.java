package cdac.egov.trafficserver.recommended.recommended_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cdac.egov.trafficserver.recommended.recommended.Recommended;

public interface RecommendedRepository extends JpaRepository<Recommended, Long> {
	@Modifying
	@Query("SELECT instances from Recommended instances WHERE instances.junctionName=:junction")
	List<Recommended> getJunctionInstances(@Param("junction") String junction);

	@Modifying
	@Query("SELECT r from Recommended r WHERE r.junctionName=:junction and r.startYear=:startYear")
	List<Recommended> getJunctionWithStartYear(@Param("junction") String junction, @Param("startYear") Integer startYear);
	
	@Modifying
	@Query("SELECT r from Recommended r WHERE r.districtName=:district and r.startYear=:startYear")
	List<Recommended> getDistrictInstancesWithStartYear(@Param("district") String district, @Param("startYear") Integer startYear);
}
