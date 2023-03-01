package com.example.back.junctionSpecifics.districts.districtsService;

import com.example.back.junctionSpecifics.districts.districts.Districts;
import com.example.back.junctionSpecifics.districts.districtsRepository.DistrictsRepository;
import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
