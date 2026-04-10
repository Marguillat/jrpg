package com.mds.jrpg.character.controller;

import com.mds.jrpg.character.dto.CharacterRequestDTO;
import com.mds.jrpg.character.dto.CharacterResponseDTO;
import com.mds.jrpg.character.service.CharacterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
     * @return The created character with a 201 Created status.
     */
    @PostMapping
    public ResponseEntity<CharacterResponseDTO> createCharacter(@RequestBody CharacterRequestDTO request) {
        CharacterResponseDTO createdCharacter = characterService.createCharacter(request);
        return new ResponseEntity<>(createdCharacter, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve all characters.
     *
     * @return A list of all characters.
     */
    @GetMapping
    public ResponseEntity<List<CharacterResponseDTO>> getAllCharacters() {
        return ResponseEntity.ok(characterService.getAllCharacters());
    }

    /**
     * Endpoint to retrieve a specific character by ID.
     *
     * @param id The character's unique identifier.
     * @return The character data.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CharacterResponseDTO> getCharacterById(@PathVariable String id) {
        return ResponseEntity.ok(characterService.getCharacterById(id));
    }

    /**
     * Endpoint to delete a character.
     *
     * @param id The character's unique identifier.
     * @return A 204 No Content status on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable String id) {
        characterService.deleteCharacter(id);
        return ResponseEntity.noContent().build();
    }
}
