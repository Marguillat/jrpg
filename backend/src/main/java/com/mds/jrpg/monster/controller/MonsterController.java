package com.mds.jrpg.monster.controller;

import com.mds.jrpg.monster.dto.MonsterRequestDTO;
import com.mds.jrpg.monster.dto.MonsterResponseDTO;
import com.mds.jrpg.monster.service.MonsterService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing the bestiary (monsters).
 * Provides endpoints for creating, retrieving, and deleting monsters.
 */
@RestController
@RequestMapping("/api/monsters")
public class MonsterController {

  private final MonsterService monsterService;

  public MonsterController(MonsterService monsterService) {
    this.monsterService = monsterService;
  }

  /**
   * Endpoint to create a new monster in the bestiary.
   *
   * @param request The monster data.
   * @return The created monster with a 201 Created status.
   */
  @PostMapping
  public ResponseEntity<MonsterResponseDTO> createMonster(
    @RequestBody MonsterRequestDTO request
  ) {
    MonsterResponseDTO createdMonster = monsterService.createMonster(request);
    return new ResponseEntity<>(createdMonster, HttpStatus.CREATED);
  }

  /**
   * Endpoint to retrieve all monsters.
   *
   * @return A list of all monsters in the bestiary.
   */
  @GetMapping
  public ResponseEntity<List<MonsterResponseDTO>> getAllMonsters() {
    return ResponseEntity.ok(monsterService.getAllMonsters());
  }

  /**
   * Endpoint to retrieve a specific monster by ID.
   *
   * @param id The monster's unique identifier.
   * @return The monster data.
   */
  @GetMapping("/{id}")
  public ResponseEntity<MonsterResponseDTO> getMonsterById(
    @PathVariable String id
  ) {
    return ResponseEntity.ok(monsterService.getMonsterById(id));
  }

  /**
   * Endpoint to delete a monster from the bestiary.
   *
   * @param id The monster's unique identifier.
   * @return A 204 No Content status on success.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMonster(@PathVariable String id) {
    monsterService.deleteMonster(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Provides metadata about the Monster resource.
   * Describes the required parameters for POST and available methods.
   *
   * @return A map containing API usage information.
   */
  @RequestMapping(method = RequestMethod.OPTIONS)
  public ResponseEntity<?> options() {
    Map<String, Object> metadata = Map.of(
      "resource",
      "Monsters",
      "allowedMethods",
      Set.of(
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.OPTIONS
      ),
      "postParameters",
      Map.of(
        "name",
        "String (required) - Name of the monster",
        "level",
        "int (required) - Level of the monster",
        "stats",
        "Stats (required) - Statistics object (strength, agility, etc.)",
        "experienceValue",
        "long (required) - XP awarded when defeated"
      ),
      "endpoints",
      List.of(
        Map.of(
          "path",
          "/api/monsters",
          "method",
          "GET",
          "description",
          "List all monsters"
        ),
        Map.of(
          "path",
          "/api/monsters",
          "method",
          "POST",
          "description",
          "Create a new monster"
        ),
        Map.of(
          "path",
          "/api/monsters/{id}",
          "method",
          "GET",
          "description",
          "Get details of a specific monster"
        ),
        Map.of(
          "path",
          "/api/monsters/{id}",
          "method",
          "DELETE",
          "description",
          "Delete a monster"
        )
      )
    );

    return ResponseEntity.ok()
      .allow(
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.OPTIONS
      )
      .body(metadata);
  }
}
