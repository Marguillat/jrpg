package com.mds.jrpg.character.dto;

import com.mds.jrpg.character.model.CharacterClass;
import com.mds.jrpg.character.model.Stats;
import java.util.List;

/**
 * Data Transfer Object for sending character information to the client.
 * Provides a structured and safe representation of the Character document.
 */
public record CharacterResponseDTO(
    String id,
    String name,
    CharacterClass characterClass,
    int level,
    long experience,
    Stats stats,
    List<String> equippedItemIds
) {
}
