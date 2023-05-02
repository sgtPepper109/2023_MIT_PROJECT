package com.example.back.user.user_service;

import com.example.back.user.user.User;
import com.example.back.user.user_repository.UserRepository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	
	private UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	public List<User> getAllUsers() { return userRepository.findAll(); }
	public List<User> getUsersWithEmail(String email) { return userRepository.getUsersWithEmail(email); }
	public User saveUser(User user) { return userRepository.save(user); }
	public void deleteUser(User user) { userRepository.delete(user); }

}
