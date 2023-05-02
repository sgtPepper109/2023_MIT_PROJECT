package cdac.egov.trafficserver.user.user_controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cdac.egov.trafficserver.user.user.User;
import cdac.egov.trafficserver.user.user.UserModel;
import cdac.egov.trafficserver.user.user_service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(UserController.class);
	private final UserService userService;

	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	@GetMapping("/getAllUsers")
	public List<User> getAllUsers() {
		log.info("GET: /user/getAllUsers");
		return userService.getAllUsers();
	}
	
	@GetMapping("/getUsersWithEmail")
	public boolean getUsersWithEmail(@RequestParam String email) {
		log.info("GET: /user/getUsersWithEmail");
		return !userService.getUsersWithEmail(email).isEmpty();
	}
	
	@PostMapping("/checkEmailAndPassword")
	public boolean checkEmailAndPassword(@RequestBody Map<String, String> signInDetails) {
		log.info("POST: /user/checkEmailAndPassword");
		return userService.checkEmailAndPassword(signInDetails);
	}

	@PostMapping("/saveUser")
	public ResponseEntity<User> saveUser(@RequestBody UserModel user) {
		log.info("POST: /user/saveUser");
		return new ResponseEntity<>(userService.saveUser(user), HttpStatus.OK);
	}
	
	@GetMapping("/setUserActive")
	public ResponseEntity<User> setActiveUser(@RequestParam String email) {
		log.info("GET: /user/setUserActive");
		return new ResponseEntity<>(userService.setActiveUser(email), HttpStatus.OK);
	}
	
	@GetMapping("/setUserInactive")
	public ResponseEntity<User> setInactiveUser(@RequestParam String email) {
		log.info("GET: /user/setUserInactive");
		return new ResponseEntity<>(userService.setInactiveUser(email), HttpStatus.OK);
	}
	
}
