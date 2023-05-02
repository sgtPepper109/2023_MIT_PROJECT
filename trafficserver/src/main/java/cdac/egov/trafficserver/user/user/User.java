package cdac.egov.trafficserver.user.user;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false, unique=true)
	private String email;
	@Column(nullable = false)
	private String password;
	@Column(nullable = false)
	private String role;
	@Column(nullable = false)
	private boolean active;
	
	public User() {}

	public User(Long id, String name, String email, String password, String role, boolean active) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.role = role;
		this.active = active;
	}
	public User(UserModel userModel) {
		this.id = userModel.id;
		this.name = userModel.name;
		this.email = userModel.email;
		this.password = userModel.password;
		this.role = userModel.role;
		this.active = userModel.active;
	}
	
	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", role=" + role
				+ ", active=" + active + "]";
	}

}
