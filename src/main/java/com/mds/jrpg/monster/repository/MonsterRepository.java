package com.mds.jrpg.monster.repository;

import com.mds.jrpg.monster.model.Monster;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for MongoDB operations on the Monster collection.
 * Provides standard CRUD operations and custom query methods for the bestiary.
 */
@Repository
public interface MonsterRepository extends MongoRepository<Monster, String> {
  /**
   * Finds a monster by its name.
   *
   * @param name The name of the monster.
   * @return An Optional containing the monster if found.
   */
  Optional<Monster> findByName(String name);

  /**
   * Checks if a monster with the given name already exists.
   *
   * @param name The name to check.
   * @return true if a monster exists with this name, false otherwise.
   */
  boolean existsByName(String name);
}
