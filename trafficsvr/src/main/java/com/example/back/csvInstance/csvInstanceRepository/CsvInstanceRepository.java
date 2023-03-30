package com.example.back.csvInstance.csvInstanceRepository;

import com.example.back.csvInstance.csvInstance.CsvInstance;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Transactional
public interface CsvInstanceRepository extends JpaRepository<CsvInstance, Long> {
	
	@Modifying
	@Query("delete from CsvInstance csvInstanceTable where csvInstanceTable.junction = :junction")
	void deleteJunctionData(@Param("junction") String junction);
	
	@Modifying
	@Query("SELECT csvInstances from CsvInstance csvInstances WHERE csvInstances.junction = :junction")
	List<CsvInstance> getJunctionData(@Param("junction") String junction);
}
