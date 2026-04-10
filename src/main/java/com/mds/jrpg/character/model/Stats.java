package com.mds.jrpg.character.model;

public record Stats(
    int strength,
    int agility,
    int intelligence,
    int maxHealth,
    int currentHealth,
    int maxMana,
    int currentMana
) {
}
