package com.mds.jrpg.character.repository;

import com.mds.jrpg.character.model.Character;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for MongoDB operations on the Character collection.
 * Extends MongoRepository to provide standard CRUD operations.
 */
@Repository
public interface CharacterRepository extends MongoRepository<Character, String> {

    /**
     * Finds a character by their unique name.
     *
     * @param name The name of the character.
     * @return An Optional containing the character if found, or empty if not.
     */
    Optional<Character> findByName(String name);

    /**
     * Checks if a character with the given name already exists.
     *
     * @param name The name to check.
     * @return true if a character exists with this name, false otherwise.
     */
    boolean existsByName(String name);
}
