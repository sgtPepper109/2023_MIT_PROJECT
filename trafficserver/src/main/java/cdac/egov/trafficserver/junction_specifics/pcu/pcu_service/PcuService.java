package cdac.egov.trafficserver.junction_specifics.pcu.pcu_service;

import java.util.List;

import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.junction_specifics.pcu.pcu.Pcu;
import cdac.egov.trafficserver.junction_specifics.pcu.pcu.PcuModel;
import cdac.egov.trafficserver.junction_specifics.pcu.pcu_repository.PcuRepository;

@Service
public class PcuService {
	
	private final PcuRepository pcuRepository;

	public PcuService( PcuRepository pcuRepository) { this.pcuRepository = pcuRepository;}
	
	public Pcu addPcu(PcuModel pcuModel) { return pcuRepository.save(new Pcu(pcuModel)); }
	public List<Pcu> getAllPcus() { return pcuRepository.findAll(); }
    public void delete(Integer roadwayWidth) { pcuRepository.delete(roadwayWidth); }
    public void update(Integer roadwayWidth, PcuModel pcuModel) {
    	pcuRepository.delete(roadwayWidth);
    	this.pcuRepository.save(new Pcu(pcuModel));
    }

}