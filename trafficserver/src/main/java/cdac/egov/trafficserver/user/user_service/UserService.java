package cdac.egov.trafficserver.user.user_service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cdac.egov.trafficserver.user.user.User;
import cdac.egov.trafficserver.user.user.UserModel;
import cdac.egov.trafficserver.user.user_repository.UserRepository;

@Service
public class UserService {
	
	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	String key = "abcd";
	
	public String encrypt(String text) {
		BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
		textEncryptor.setPassword(key);
		return textEncryptor.encrypt(text);
	}
	
	public String decrypt(String text) {
		BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
		textEncryptor.setPassword(key);
		return textEncryptor.decrypt(text);
	}

	public List<User> getAllUsers() { return userRepository.findAll(); }
	public List<User> getUsersWithEmail(String email) { return userRepository.getUsersWithEmail(email); }
	public void deleteUser(User user) { userRepository.delete(user); }
	public User saveUser(User user) { return userRepository.save(user); }
	public User saveUser(UserModel userModel) {
		User toSave = new User(userModel);
		String encrypted = this.encrypt(toSave.getPassword());
		toSave.setPassword(encrypted);
		return userRepository.save(toSave);
	}
	public boolean checkEmailAndPassword(Map<String, String> signInDetails) {
		String email = signInDetails.get("email");
		String password = signInDetails.get("password");
		List<User> existing = getUsersWithEmail(email);
		boolean found = false;
		for (User u: existing) {
			try {
				String decrypted = decrypt(u.getPassword());
				if (Objects.equals(password, decrypted)) {
					found = true;
					break;
				}
			} catch (Exception e) {
				// do nothing
			}
		}
		return found;
	}
	public User setActiveUser(String email) {
		User existingUser = getUsersWithEmail(email).get(0);
		existingUser.setActive(true);
		return saveUser(existingUser);
	}
	public User setInactiveUser(String email) {
		User existingUser = getUsersWithEmail(email).get(0);
		existingUser.setActive(false);
		return saveUser(existingUser);
	}

}
