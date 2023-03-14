package com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMapRepository;

import com.example.back.junctionSpecifics.junctionDistrictMap.junctionDistrictMap.JunctionDistrictMap;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Transactional
public interface JunctionDistrictMapRepository extends JpaRepository<JunctionDistrictMap, Long> {
	
	@Modifying
	@Query("delete from JunctionDistrictMap j where j.junctionName = :junction")
	void delete(@Param("junction") String junction);

}
