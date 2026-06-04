package com.mds.jrpg.item.service;

import com.mds.jrpg.character.model.Character;
import com.mds.jrpg.character.model.Stats;
import com.mds.jrpg.character.repository.CharacterRepository;
import com.mds.jrpg.common.exception.ResourceNotFoundException;
import com.mds.jrpg.item.dto.ItemRequestDTO;
import com.mds.jrpg.item.dto.ItemResponseDTO;
import com.mds.jrpg.item.model.Item;
import com.mds.jrpg.item.repository.ItemRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class handling the business logic for Items and Equipment.
 * Responsible for item creation, retrieval, and the logic of equipping items to characters.
 */
@Service
public class ItemService {

  private final ItemRepository itemRepository;
  private final CharacterRepository characterRepository;

  public ItemService(
    ItemRepository itemRepository,
    CharacterRepository characterRepository
  ) {
    this.itemRepository = itemRepository;
    this.characterRepository = characterRepository;
  }

  /**
   * Creates a new item in the database.
   *
   * @param request The item creation request DTO.
   * @return The created item as a response DTO.
   */
  @Transactional
  public ItemResponseDTO createItem(ItemRequestDTO request) {
    if (itemRepository.existsByName(request.name())) {
      throw new IllegalArgumentException(
        "Item with name '" + request.name() + "' already exists."
      );
    }

    Item item = new Item(
      request.name(),
      request.type(),
      request.strengthBonus(),
      request.agilityBonus(),
      request.intelligenceBonus(),
      request.healthBonus(),
      request.manaBonus()
    );

    Item savedItem = itemRepository.save(item);
    return mapToResponseDTO(savedItem);
  }

  /**
   * Retrieves all items.
   *
   * @return A list of item response DTOs.
   */
  public List<ItemResponseDTO> getAllItems() {
    return itemRepository
      .findAll()
      .stream()
      .map(this::mapToResponseDTO)
      .collect(Collectors.toList());
  }

  /**
   * Retrieves an item by its ID.
   *
   * @param id The item ID.
   * @return The item response DTO.
   */
  public ItemResponseDTO getItemById(String id) {
    Item item = itemRepository
      .findById(id)
      .orElseThrow(() ->
        new ResourceNotFoundException("Item not found with id: " + id)
      );
    return mapToResponseDTO(item);
  }

  /**
   * Equips an item to a character and updates the character's stats.
   *
   * @param characterId The ID of the character.
   * @param itemId      The ID of the item to equip.
   * @return The updated character state (simplified logic for now).
   */
  @Transactional
  public void equipItem(String characterId, String itemId) {
    Character character = characterRepository
      .findById(characterId)
      .orElseThrow(() ->
        new ResourceNotFoundException(
          "Character not found with id: " + characterId
        )
      );

    Item item = itemRepository
      .findById(itemId)
      .orElseThrow(() ->
        new ResourceNotFoundException("Item not found with id: " + itemId)
      );

    if (character.getEquippedItemIds().contains(itemId)) {
      throw new IllegalArgumentException("Item is already equipped.");
    }

    // Add to equipped list
    character.getEquippedItemIds().add(itemId);

    // Apply stat bonuses
    Stats currentStats = character.getStats();
    Stats newStats = new Stats(
      currentStats.strength() + item.getStrengthBonus(),
      currentStats.agility() + item.getAgilityBonus(),
      currentStats.intelligence() + item.getIntelligenceBonus(),
      currentStats.maxHealth() + item.getHealthBonus(),
      currentStats.currentHealth() + item.getHealthBonus(),
      currentStats.maxMana() + item.getManaBonus(),
      currentStats.currentMana() + item.getManaBonus()
    );

    character.setStats(newStats);
    characterRepository.save(character);
  }

  private ItemResponseDTO mapToResponseDTO(Item item) {
    return new ItemResponseDTO(
      item.getId(),
      item.getName(),
      item.getType(),
      item.getStrengthBonus(),
      item.getAgilityBonus(),
      item.getIntelligenceBonus(),
      item.getHealthBonus(),
      item.getManaBonus()
    );
  }
}
