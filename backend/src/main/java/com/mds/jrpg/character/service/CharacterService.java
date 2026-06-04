package com.mds.jrpg.character.service;

import com.mds.jrpg.character.dto.CharacterRequestDTO;
import com.mds.jrpg.character.dto.CharacterResponseDTO;
import com.mds.jrpg.character.model.Character;
import com.mds.jrpg.character.model.CharacterClass;
import com.mds.jrpg.character.model.Stats;
import com.mds.jrpg.character.repository.CharacterRepository;
import com.mds.jrpg.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class handling the business logic for Characters.
 * Responsible for character creation, stat calculation, and retrieval.
 */
@Service
public class CharacterService {

    private final CharacterRepository characterRepository;

    public CharacterService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    /**
     * Creates a new character based on the provided request DTO.
     * Calculates initial stats based on the chosen class.
     *
     * @param request The character creation request.
     * @return The created character as a response DTO.
     * @throws IllegalArgumentException if the name is already taken.
     */
    @Transactional
    public CharacterResponseDTO createCharacter(CharacterRequestDTO request) {
        if (characterRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Character name '" + request.name() + "' is already taken.");
        }

        Stats initialStats = calculateInitialStats(request.characterClass());

        Character character = new Character(
                request.name(),
                request.characterClass(),
                1, // Level 1
                0, // 0 XP
                initialStats
        );

        Character savedCharacter = characterRepository.save(character);
        return mapToResponseDTO(savedCharacter);
    }

    /**
     * Retrieves all characters from the database.
     *
     * @return A list of character response DTOs.
     */
    public List<CharacterResponseDTO> getAllCharacters() {
        return characterRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a character by its ID.
     *
     * @param id The unique identifier of the character.
     * @return The character response DTO.
     * @throws ResourceNotFoundException if no character is found.
     */
    public CharacterResponseDTO getCharacterById(String id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id: " + id));
        return mapToResponseDTO(character);
    }

    /**
     * Deletes a character by its ID.
     *
     * @param id The unique identifier of the character to delete.
     */
    public void deleteCharacter(String id) {
        if (!characterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Character not found with id: " + id);
        }
        characterRepository.deleteById(id);
    }

    /**
     * Private helper to calculate base stats depending on the character class.
     */
    private Stats calculateInitialStats(CharacterClass characterClass) {
        return switch (characterClass) {
            case WARRIOR -> new Stats(15, 8, 5, 120, 120, 20, 20);
            case MAGE -> new Stats(5, 7, 18, 70, 70, 150, 150);
            case ROGUE -> new Stats(10, 18, 8, 90, 90, 40, 40);
            case CLERIC -> new Stats(8, 6, 15, 100, 100, 100, 100);
            case PALADIN -> new Stats(12, 6, 10, 110, 110, 60, 60);
        };
    }

    /**
     * Maps a Character entity to a CharacterResponseDTO.
     */
    private CharacterResponseDTO mapToResponseDTO(Character character) {
        return new CharacterResponseDTO(
                character.getId(),
                character.getName(),
                character.getCharacterClass(),
                character.getLevel(),
                character.getExperience(),
                character.getStats(),
                character.getEquippedItemIds()
        );
    }
}
