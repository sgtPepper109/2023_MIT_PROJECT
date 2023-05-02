package cdac.egov.trafficserver.junction_specifics.pcu.pcu_repository;

import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cdac.egov.trafficserver.junction_specifics.pcu.pcu.Pcu;

@Transactional
public interface PcuRepository extends JpaRepository<Pcu, Long> {
	
	@Modifying
	@Query("delete from Pcu r where r.roadwayWidth= :roadwayWidth")
	void delete(@Param("roadwayWidth") Integer roadwayWidth);
	
}
