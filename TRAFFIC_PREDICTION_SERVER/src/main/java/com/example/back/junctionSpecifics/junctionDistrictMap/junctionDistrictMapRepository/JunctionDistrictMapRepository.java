package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapRepository;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JunctionDistrictMapRepository extends JpaRepository<JunctionDistrictMap, Long> {

	@Modifying
	@Query(value = "TRUNCATE TABLE junction_district_map;", nativeQuery = true)
	void truncateRedundantJunctionDistrictMaps();

}
