package com.mds.jrpg.battle.dto;

import java.util.List;

/**
 * Data Transfer Object summarizing the result of a battle.
 * Contains information about the outcome, combat log, and rewards earned.
 */
public record BattleResultDTO(
  String characterName,
  String monsterName,
  boolean victory,
  long experienceGained,
  List<String> log
) {}
