package com.example.back.user.userRepository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.back.user.user.User;

@Transactional
public interface UserRepository extends JpaRepository<User, Long> {
	@Modifying
	@Query("SELECT u from User u WHERE u.email= :email")
	List<User> getUsersWithEmail(@Param("email") String email);
}
