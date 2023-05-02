package cdac.egov.trafficserver.junction_specifics.junction_district.junction_district_repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cdac.egov.trafficserver.junction_specifics.junction_district.junction_district.JunctionDistrict;

@Transactional
public interface JunctionDistrictRepository extends JpaRepository<JunctionDistrict, Long> {
	
	@Modifying
	@Query("delete from JunctionDistrict j where j.junctionName = :junction")
	void delete(@Param("junction") String junction);

}
