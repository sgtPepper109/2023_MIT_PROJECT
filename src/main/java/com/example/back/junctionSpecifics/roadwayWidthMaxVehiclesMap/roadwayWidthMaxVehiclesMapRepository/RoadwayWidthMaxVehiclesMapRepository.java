package com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMapRepository;

import com.example.back.junctionSpecifics.roadwayWidthMaxVehiclesMap.roadwayWidthMaxVehiclesMap.RoadwayWidthMaxVehiclesMap;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Transactional
public interface RoadwayWidthMaxVehiclesMapRepository extends JpaRepository<RoadwayWidthMaxVehiclesMap, Long> {
	
	@Modifying
	@Query("delete from RoadwayWidthMaxVehiclesMap r where r.roadwayWidth= :roadwayWidth")
	void delete(@Param("roadwayWidth") Integer roadwayWidth);
	
}
