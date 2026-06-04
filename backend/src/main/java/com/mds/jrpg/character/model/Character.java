package com.mds.jrpg.character.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * MongoDB Document representing a JRPG Character.
 */
@Document(collection = "characters")
public class Character {

    @Id
    private String id;
    private String name;
    private CharacterClass characterClass;
    private int level;
    private long experience;
    private Stats stats;
    private List<String> equippedItemIds = new ArrayList<>();

    public Character() {}

    public Character(String name, CharacterClass characterClass, int level, long experience, Stats stats) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = level;
        this.experience = experience;
        this.stats = stats;
        this.equippedItemIds = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CharacterClass getCharacterClass() { return characterClass; }
    public void setCharacterClass(CharacterClass characterClass) { this.characterClass = characterClass; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public long getExperience() { return experience; }
    public void setExperience(long experience) { this.experience = experience; }
    public Stats getStats() { return stats; }
    public void setStats(Stats stats) { this.stats = stats; }
    public List<String> getEquippedItemIds() { return equippedItemIds; }
    public void setEquippedItemIds(List<String> equippedItemIds) { this.equippedItemIds = equippedItemIds; }
}
