package com.mds.jrpg.auth.repository;

import com.mds.jrpg.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * MongoDB Repository for User documents.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
