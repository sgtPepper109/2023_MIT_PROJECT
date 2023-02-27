package com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMapService;

import com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMap.JunctionMaxVehiclesMap;
import com.example.back.junctionSpecifics.junctionMaxVehiclesMap.junctionMaxVehiclesMapRepository.JunctionMaxVehiclesMapRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JunctionMaxVehiclesMapService {

	private final JunctionMaxVehiclesMapRepository junctionMaxVehiclesMapRepository;

	@Autowired
	public JunctionMaxVehiclesMapService(JunctionMaxVehiclesMapRepository junctionMaxVehiclesMapRepository) {
		this.junctionMaxVehiclesMapRepository = junctionMaxVehiclesMapRepository;
	}
	
	public JunctionMaxVehiclesMap addJunctionMaxVehiclesMap(JunctionMaxVehiclesMap junctionMaxVehiclesMap) {
		return junctionMaxVehiclesMapRepository.save(junctionMaxVehiclesMap);
	}
	
	public void truncateRedundantJunctionMaxVehiclesMap() {
		junctionMaxVehiclesMapRepository.deleteAll();
	}
	
	public List<JunctionMaxVehiclesMap> findAllJunctionMaxVehiclesMap() {
		List<JunctionMaxVehiclesMap> list=junctionMaxVehiclesMapRepository.findAll();
		list.stream().forEach(System.out::println);
		return list;
	}
	
}
