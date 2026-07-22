package com.exlay.mixer.repository;

import com.exlay.mixer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByTag(String tag);

    boolean existsByTag(String tag);

}
