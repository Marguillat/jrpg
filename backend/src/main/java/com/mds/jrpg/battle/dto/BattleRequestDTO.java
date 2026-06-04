package com.mds.jrpg.battle.dto;

/**
 * Data Transfer Object for initiating a battle.
 * Contains the unique identifiers for the character and the monster.
 */
public record BattleRequestDTO(String characterId, String monsterId) {}
