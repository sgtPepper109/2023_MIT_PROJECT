package com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMapRepository;

import com.example.back.junctionSpecifics.junctionRoadwayWidthMap.junctionRoadwayWidthMap.JunctionRoadwayWidthMap;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Transactional
public interface JunctionRoadwayWidthMapRepository extends JpaRepository<JunctionRoadwayWidthMap, Long> {
	
	@Modifying
	@Query("delete from JunctionRoadwayWidthMap j where j.junctionName = :junction")
	void delete(@Param("junction") String junction);
	
}
