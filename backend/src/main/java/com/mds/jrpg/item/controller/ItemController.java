package com.mds.jrpg.item.controller;

import com.mds.jrpg.item.dto.ItemRequestDTO;
import com.mds.jrpg.item.dto.ItemResponseDTO;
import com.mds.jrpg.item.service.ItemService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing items and equipment.
 * Provides endpoints for creating, retrieving items and equipping them to characters.
 */
@RestController
@RequestMapping("/api/items")
public class ItemController {

  private final ItemService itemService;

  public ItemController(ItemService itemService) {
    this.itemService = itemService;
  }

  /**
   * Endpoint to create a new item.
   *
   * @param request The item data.
   * @return The created item with a 201 Created status.
   */
  @PostMapping
  public ResponseEntity<ItemResponseDTO> createItem(
    @RequestBody ItemRequestDTO request
  ) {
    ItemResponseDTO createdItem = itemService.createItem(request);
    return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
  }

  /**
   * Endpoint to retrieve all items.
   *
   * @return A list of all items.
   */
  @GetMapping
  public ResponseEntity<List<ItemResponseDTO>> getAllItems() {
    return ResponseEntity.ok(itemService.getAllItems());
  }

  /**
   * Endpoint to retrieve a specific item by ID.
   *
   * @param id The item's unique identifier.
   * @return The item data.
   */
  @GetMapping("/{id}")
  public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable String id) {
    return ResponseEntity.ok(itemService.getItemById(id));
  }

  /**
   * Endpoint to equip an item to a character.
   *
   * @param itemId      The ID of the item.
   * @param characterId The ID of the character.
   * @return A 200 OK status on success.
   */
  @PostMapping("/{itemId}/equip/{characterId}")
  public ResponseEntity<Void> equipItem(
    @PathVariable String itemId,
    @PathVariable String characterId
  ) {
    itemService.equipItem(characterId, itemId);
    return ResponseEntity.ok().build();
  }

  /**
   * Provides metadata about the Item resource.
   * Describes the required parameters for POST and available methods.
   *
   * @return A map containing API usage information.
   */
  @RequestMapping(method = RequestMethod.OPTIONS)
  public ResponseEntity<?> options() {
    Map<String, Object> metadata = Map.of(
      "resource",
      "Items",
      "allowedMethods",
      Set.of(HttpMethod.GET, HttpMethod.POST, HttpMethod.OPTIONS),
      "postParameters",
      Map.of(
        "name",
        "String (required) - Name of the item",
        "type",
        "Enum (required) - WEAPON, ARMOR, CONSUMABLE, QUEST_ITEM, ACCESSORY",
        "strengthBonus",
        "int - Bonus to strength",
        "agilityBonus",
        "int - Bonus to agility",
        "intelligenceBonus",
        "int - Bonus to intelligence",
        "healthBonus",
        "int - Bonus to health",
        "manaBonus",
        "int - Bonus to mana"
      ),
      "endpoints",
      List.of(
        Map.of(
          "path",
          "/api/items",
          "method",
          "GET",
          "description",
          "List all items"
        ),
        Map.of(
          "path",
          "/api/items",
          "method",
          "POST",
          "description",
          "Create a new item"
        ),
        Map.of(
          "path",
          "/api/items/{id}",
          "method",
          "GET",
          "description",
          "Get details of a specific item"
        ),
        Map.of(
          "path",
          "/api/items/{itemId}/equip/{characterId}",
          "method",
          "POST",
          "description",
          "Equip an item to a character"
        )
      )
    );

    return ResponseEntity.ok()
      .allow(HttpMethod.GET, HttpMethod.POST, HttpMethod.OPTIONS)
      .body(metadata);
  }
}
