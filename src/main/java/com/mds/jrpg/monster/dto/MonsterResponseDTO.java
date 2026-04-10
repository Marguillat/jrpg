package com.mds.jrpg.monster.dto;

import com.mds.jrpg.character.model.Stats;

/**
 * Data Transfer Object for sending monster information to the client.
 * Provides a structured and safe representation of the Monster document.
 */
public record MonsterResponseDTO(
  String id,
  String name,
  int level,
  Stats stats,
  long experienceValue
) {}
