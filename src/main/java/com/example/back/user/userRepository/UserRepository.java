package com.example.back.user.userRepository;

import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.back.user.user.User;

@Transactional
public interface UserRepository extends JpaRepository<User, Long> {}
