package com.mds.jrpg.item.repository;

import com.mds.jrpg.item.model.Item;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for MongoDB operations on the Item collection.
 * Extends MongoRepository to provide standard CRUD operations.
 */
@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
  /**
   * Finds an item by its name.
   *
   * @param name The name of the item.
   * @return An Optional containing the item if found.
   */
  Optional<Item> findByName(String name);

  /**
   * Checks if an item with the given name already exists.
   *
   * @param name The name to check.
   * @return true if an item exists with this name, false otherwise.
   */
  boolean existsByName(String name);
}
