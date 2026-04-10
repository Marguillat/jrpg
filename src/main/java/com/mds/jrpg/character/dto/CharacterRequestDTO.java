package com.mds.jrpg.character.dto;

import com.mds.jrpg.character.model.CharacterClass;

/**
 * Data Transfer Object for creating or updating a character.
 * Contains validation and fields necessary for character initialization.
 */
public record CharacterRequestDTO(
    String name,
    CharacterClass characterClass
) {
}
