package com.example.back.districtTreatmentCount.districtTreatmentCountRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.back.districtTreatmentCount.districtTreatmentCount.DistrictTreatmentCount;

public interface DistrictTreatmentCountRepository extends JpaRepository<DistrictTreatmentCount, Long> {
	@Modifying
	@Query("SELECT d from DistrictTreatmentCount d WHERE d.districtName= :district and d.startYear= :startYear")
	List<DistrictTreatmentCount> getDistrictInstancesWithStartTime(@Param("district") String district, @Param("startYear") Integer startYear);
}
