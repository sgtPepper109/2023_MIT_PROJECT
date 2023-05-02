package com.example.back.districtTreatmentCount.districtTreatmentCountRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.back.districtTreatmentCount.districtTreatmentCount.DistrictTreatmentCount;

public interface DistrictTreatmentCountRepository extends JpaRepository<DistrictTreatmentCount, Long> {
	@Modifying
	@Query("SELECT instances from DistrictTreatmentCount instances WHERE instances.districtName= :district")
	List<DistrictTreatmentCount> getDistrictInstances(@Param("district") String district);
}