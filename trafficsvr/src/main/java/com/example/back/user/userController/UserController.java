package com.example.back.user.userController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.user.user.User;
import com.example.back.user.userService.UserService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/user")
public class UserController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(UserController.class);
	private UserService userService;
	private String key = "abcd";

	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}
	
	@GetMapping("/getAllUsers")
	public List<User> getAllUsers() { return userService.getAllUsers(); }
	
	@GetMapping("/getUsersWithEmail")
	public boolean getUsersWithEmail(@RequestParam String email) {
		List<User> existing = userService.getUsersWithEmail(email);
		return existing.isEmpty()? false: true;
	}
	
	@PostMapping("/checkEmailAndPassword")
	public boolean checkEmailAndPassword(@RequestBody HashMap<String, String> signInDetails) {
		String email = signInDetails.get("email");
		String password = signInDetails.get("password");
		List<User> existing = userService.getUsersWithEmail(email);
		boolean found = false;
		for (User u: existing) {
			try {
				String decrypted = this.decrypt(u.getPassword());
				if (Objects.equals(password, decrypted)) {
					found = true;
				}
			} catch (Exception e) {
				continue;
			}
		}
		return found;
	}

	@PostMapping("/saveUser")
	public ResponseEntity<User> saveUser(@RequestBody User user) {
		String encrypted = this.encrypt(user.getPassword());
		user.setPassword(encrypted);
		return new ResponseEntity<User>(userService.saveUser(user), HttpStatus.OK);
	}
	
//	@GetMapping("/encr")
//    public List<String> encr() {
//		String text = "abcd";
//		BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
//		textEncryptor.setPassword("1990");
//		String encryptedText = textEncryptor.encrypt(text);
//		List<String> toReturn = new ArrayList<String>();
//		toReturn.add(encryptedText);
//		String decryptedText = textEncryptor.decrypt(encryptedText);
//		toReturn.add(decryptedText);
//		return toReturn;
//    }
	
	
	@GetMapping("/setUserActive")
	public User setActiveUser(@RequestParam String email) {
		List<User> existing = userService.getUsersWithEmail(email);
		User existingUser = existing.get(0);
		existingUser.setActive(true);
		return userService.saveUser(existingUser);
	}
	
	@GetMapping("/setUserInactive")
	public User setInactiveUser(@RequestParam String email) {
		List<User> existing = userService.getUsersWithEmail(email);
		User existingUser = existing.get(0);
		existingUser.setActive(false);
		return userService.saveUser(existingUser);
	}
	
	public String encrypt(String text) {
		BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
		textEncryptor.setPassword(this.key);
		return textEncryptor.encrypt(text);
	}
	
	public String decrypt(String text) {
		BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
		textEncryptor.setPassword(this.key);
		return textEncryptor.decrypt(text);
	}

}
