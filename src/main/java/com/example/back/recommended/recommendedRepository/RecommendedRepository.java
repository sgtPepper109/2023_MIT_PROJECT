package com.example.back.recommended.recommendedRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.back.csvInstance.csvInstance.CsvInstance;
import com.example.back.recommended.recommended.Recommended;

public interface RecommendedRepository extends JpaRepository<Recommended, Long> {
	@Modifying
	@Query("SELECT instances from Recommended instances WHERE instances.junctionName=:junction")
	List<Recommended> getJunctionInstances(@Param("junction") String junction);
}
