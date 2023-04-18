package com.example.back.user.userController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.back.user.userService.UserService;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/user")
public class UserController {
	
    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(UserController.class);
	private UserService userService;

	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

}
