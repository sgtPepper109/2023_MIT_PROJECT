package com.example.back.junction_specifics.districts.districts_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back.junction_specifics.districts.districts.Districts;
import com.example.back.junction_specifics.districts.districts_repository.DistrictsRepository;

@Service
public class DistrictsService {
	
	private final DistrictsRepository districtsRepository;

	@Autowired
	public DistrictsService(DistrictsRepository districtsRepository) {
		this.districtsRepository = districtsRepository;
	}
	
	
	public List<Districts> getAllDistricts() {
		return districtsRepository.findAll();
	}

}
