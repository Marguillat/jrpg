package com.mds.jrpg.character.controller;

import com.mds.jrpg.character.dto.CharacterRequestDTO;
import com.mds.jrpg.character.dto.CharacterResponseDTO;
import com.mds.jrpg.character.service.CharacterService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing characters.
 * Provides endpoints for creating, retrieving, and deleting characters.
 */
@RestController
@RequestMapping("/api/characters")
public class CharacterController {

  private final CharacterService characterService;

  public CharacterController(CharacterService characterService) {
    this.characterService = characterService;
  }

  /**
   * Endpoint to create a new character.
   *
   * @param request The character data.
   * @param principal The authenticated user principal.
   * @return The created character with a 201 Created status.
   */
  @PostMapping
  public ResponseEntity<CharacterResponseDTO> createCharacter(
    @RequestBody CharacterRequestDTO request,
    Principal principal
  ) {
    CharacterResponseDTO createdCharacter = characterService.createCharacter(
      request,
      principal.getName()
    );
    return new ResponseEntity<>(createdCharacter, HttpStatus.CREATED);
  }

  /**
   * Endpoint to retrieve all characters for the logged-in user.
   *
   * @param principal The authenticated user principal.
   * @return A list of the user's characters.
   */
  @GetMapping
  public ResponseEntity<List<CharacterResponseDTO>> getAllCharacters(
    Principal principal
  ) {
    return ResponseEntity.ok(characterService.getAllCharacters(principal.getName()));
  }

  /**
   * Endpoint to retrieve a specific character by ID, verifying ownership.
   *
   * @param id The character's unique identifier.
   * @param principal The authenticated user principal.
   * @return The character data.
   */
  @GetMapping("/{id}")
  public ResponseEntity<CharacterResponseDTO> getCharacterById(
    @PathVariable String id,
    Principal principal
  ) {
    return ResponseEntity.ok(characterService.getCharacterById(id, principal.getName()));
  }

  /**
   * Endpoint to delete a character, verifying ownership.
   *
   * @param id The character's unique identifier.
   * @param principal The authenticated user principal.
   * @return A 204 No Content status on success.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCharacter(
    @PathVariable String id,
    Principal principal
  ) {
    characterService.deleteCharacter(id, principal.getName());
    return ResponseEntity.noContent().build();
  }

  /**
   * Provides metadata about the Character resource.
   * Describes the required parameters for POST and available methods.
   *
   * @return A map containing API usage information.
   */
  @RequestMapping(method = RequestMethod.OPTIONS)
  public ResponseEntity<?> options() {
    Map<String, Object> metadata = Map.of(
      "resource",
      "Characters",
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
        "String (required) - Unique name of the character",
        "characterClass",
        "Enum (required) - WARRIOR, MAGE, ROGUE, CLERIC, PALADIN"
      ),
      "endpoints",
      List.of(
        Map.of(
          "path",
          "/api/characters",
          "method",
          "GET",
          "description",
          "List all characters"
        ),
        Map.of(
          "path",
          "/api/characters",
          "method",
          "POST",
          "description",
          "Create a new character"
        ),
        Map.of(
          "path",
          "/api/characters/{id}",
          "method",
          "GET",
          "description",
          "Get details of a specific character"
        ),
        Map.of(
          "path",
          "/api/characters/{id}",
          "method",
          "DELETE",
          "description",
          "Delete a character"
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
