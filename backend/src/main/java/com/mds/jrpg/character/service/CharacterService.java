package com.mds.jrpg.character.service;

import com.mds.jrpg.character.dto.CharacterRequestDTO;
import com.mds.jrpg.character.dto.CharacterResponseDTO;
import com.mds.jrpg.character.model.Character;
import com.mds.jrpg.character.model.CharacterClass;
import com.mds.jrpg.character.model.Stats;
import com.mds.jrpg.character.repository.CharacterRepository;
import com.mds.jrpg.common.exception.ResourceNotFoundException;
import com.mds.jrpg.common.exception.UnauthorizedException;
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
     * Creates a new character based on the provided request DTO and owner username.
     * Calculates initial stats based on the chosen class.
     *
     * @param request The character creation request.
     * @param ownerUsername The username of the authenticated creator.
     * @return The created character as a response DTO.
     * @throws IllegalArgumentException if the name is already taken.
     */
    @Transactional
    public CharacterResponseDTO createCharacter(CharacterRequestDTO request, String ownerUsername) {
        if (characterRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Character name '" + request.name() + "' is already taken.");
        }

        Stats initialStats = calculateInitialStats(request.characterClass());

        Character character = new Character(
                request.name(),
                request.characterClass(),
                1, // Level 1
                0, // 0 XP
                initialStats,
                ownerUsername
        );

        Character savedCharacter = characterRepository.save(character);
        return mapToResponseDTO(savedCharacter);
    }

    /**
     * Retrieves all characters belonging to a specific owner.
     *
     * @param ownerUsername The owner's username.
     * @return A list of character response DTOs.
     */
    public List<CharacterResponseDTO> getAllCharacters(String ownerUsername) {
        return characterRepository.findByOwnerUsername(ownerUsername)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a character by its ID, verifying ownership.
     *
     * @param id The unique identifier of the character.
     * @param ownerUsername The owner's username.
     * @return The character response DTO.
     * @throws ResourceNotFoundException if no character is found.
     * @throws UnauthorizedException if the character does not belong to the owner.
     */
    public CharacterResponseDTO getCharacterById(String id, String ownerUsername) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id: " + id));
        if (!character.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedException("You do not own this character.");
        }
        return mapToResponseDTO(character);
    }

    /**
     * Deletes a character by its ID, verifying ownership.
     *
     * @param id The unique identifier of the character to delete.
     * @param ownerUsername The owner's username.
     */
    public void deleteCharacter(String id, String ownerUsername) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id: " + id));
        if (!character.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedException("You do not own this character.");
        }
        characterRepository.delete(character);
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
