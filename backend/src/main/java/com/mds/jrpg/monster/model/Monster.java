package com.mds.jrpg.monster.model;

import com.mds.jrpg.character.model.Stats;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MongoDB Document representing a Monster in the JRPG.
 * Monsters have statistics and provide experience points when defeated.
 */
@Document(collection = "monsters")
public class Monster {

  @Id
  private String id;

  private String name;
  private int level;
  private Stats stats;
  private long experienceValue;

  public Monster() {}

  public Monster(String name, int level, Stats stats, long experienceValue) {
    this.name = name;
    this.level = level;
    this.stats = stats;
    this.experienceValue = experienceValue;
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public Stats getStats() {
    return stats;
  }

  public void setStats(Stats stats) {
    this.stats = stats;
  }

  public long getExperienceValue() {
    return experienceValue;
  }

  public void setExperienceValue(long experienceValue) {
    this.experienceValue = experienceValue;
  }
}
