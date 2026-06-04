package com.mds.jrpg.monster.dto;

import com.mds.jrpg.character.model.Stats;

/**
 * Data Transfer Object for creating or updating a Monster.
 * Contains the necessary fields and validation for monster initialization.
 */
public record MonsterRequestDTO(
  String name,
  int level,
  Stats stats,
  long experienceValue
) {}
