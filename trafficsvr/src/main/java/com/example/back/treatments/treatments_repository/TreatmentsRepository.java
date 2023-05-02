package com.example.back.treatments.treatments_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.back.treatments.treatments.Treatments;

public interface TreatmentsRepository extends JpaRepository<Treatments, Long> {
	@Modifying
	@Query("SELECT d from Treatments d WHERE d.districtName= :district and d.startYear= :startYear")
	List<Treatments> getDistrictInstancesWithStartTime(@Param("district") String district, @Param("startYear") Integer startYear);
}
