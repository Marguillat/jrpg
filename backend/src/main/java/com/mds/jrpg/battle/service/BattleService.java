package com.mds.jrpg.battle.service;

import com.mds.jrpg.battle.dto.BattleRequestDTO;
import com.mds.jrpg.battle.dto.BattleResultDTO;
import com.mds.jrpg.character.model.Character;
import com.mds.jrpg.character.model.Stats;
import com.mds.jrpg.character.repository.CharacterRepository;
import com.mds.jrpg.common.exception.ResourceNotFoundException;
import com.mds.jrpg.common.exception.UnauthorizedException;
import com.mds.jrpg.monster.model.Monster;
import com.mds.jrpg.monster.repository.MonsterRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class handling the JRPG combat engine.
 * Manages turn-based logic, damage calculation, and experience rewards.
 */
@Service
public class BattleService {

  private final CharacterRepository characterRepository;
  private final MonsterRepository monsterRepository;

  public BattleService(
    CharacterRepository characterRepository,
    MonsterRepository monsterRepository
  ) {
    this.characterRepository = characterRepository;
    this.monsterRepository = monsterRepository;
  }

  /**
   * Executes a battle between a character and a monster.
   * The battle is automated and turn-based.
   *
   * @param request The battle request containing IDs.
   * @param ownerUsername The username of the character owner.
   * @return A summary of the battle result.
   */
  @Transactional
  public BattleResultDTO startBattle(BattleRequestDTO request, String ownerUsername) {
    Character character = characterRepository
      .findById(request.characterId())
      .orElseThrow(() ->
        new ResourceNotFoundException(
          "Character not found with id: " + request.characterId()
        )
      );

    if (!character.getOwnerUsername().equals(ownerUsername)) {
      throw new UnauthorizedException("You do not own this character.");
    }

    Monster monster = monsterRepository
      .findById(request.monsterId())
      .orElseThrow(() ->
        new ResourceNotFoundException(
          "Monster not found with id: " + request.monsterId()
        )
      );

    List<String> battleLog = new ArrayList<>();
    battleLog.add(
      "Battle starts: " + character.getName() + " vs " + monster.getName()
    );

    Stats charStats = character.getStats();
    Stats monsterStats = monster.getStats();

    int charHp = charStats.currentHealth();
    int monsterHp = monsterStats.currentHealth();

    boolean characterTurn = charStats.agility() >= monsterStats.agility();

    while (charHp > 0 && monsterHp > 0) {
      if (characterTurn) {
        int damage = calculateDamage(
          charStats.strength(),
          monsterStats.agility()
        );
        monsterHp -= damage;
        battleLog.add(
          character.getName() +
            " hits " +
            monster.getName() +
            " for " +
            damage +
            " damage. (" +
            Math.max(0, monsterHp) +
            " HP left)"
        );
      } else {
        int damage = calculateDamage(
          monsterStats.strength(),
          charStats.agility()
        );
        charHp -= damage;
        battleLog.add(
          monster.getName() +
            " hits " +
            character.getName() +
            " for " +
            damage +
            " damage. (" +
            Math.max(0, charHp) +
            " HP left)"
        );
      }
      characterTurn = !characterTurn;
    }

    boolean victory = monsterHp <= 0;
    long xpGained = 0;

    if (victory) {
      battleLog.add(monster.getName() + " has been defeated!");
      xpGained = monster.getExperienceValue();
      applyExperience(character, xpGained, battleLog);
    } else {
      battleLog.add(character.getName() + " has been defeated...");
    }

    // Update character health post-battle (clamped at 1 if they lost for gameplay reasons, or actual value)
    Stats updatedStats = new Stats(
      charStats.strength(),
      charStats.agility(),
      charStats.intelligence(),
      charStats.maxHealth(),
      Math.max(1, charHp),
      charStats.maxMana(),
      charStats.currentMana()
    );
    character.setStats(updatedStats);
    characterRepository.save(character);

    return new BattleResultDTO(
      character.getName(),
      monster.getName(),
      victory,
      xpGained,
      battleLog
    );
  }

  /**
   * Simple damage formula: (Strength * 2) - (Agility / 2).
   */
  private int calculateDamage(int attackerStrength, int defenderAgility) {
    int baseDamage = attackerStrength * 2;
    int mitigation = defenderAgility / 2;
    return Math.max(1, baseDamage - mitigation);
  }

  /**
   * Logic to handle experience gain and level up.
   */
  private void applyExperience(Character character, long xp, List<String> log) {
    character.setExperience(character.getExperience() + xp);
    log.add(character.getName() + " gained " + xp + " XP.");

    long nextLevelXp = character.getLevel() * 100L;
    if (character.getExperience() >= nextLevelXp) {
      character.setLevel(character.getLevel() + 1);
      log.add(
        "LEVEL UP! " +
          character.getName() +
          " is now level " +
          character.getLevel() +
          "!"
      );

      // Basic stat growth
      Stats s = character.getStats();
      Stats upgraded = new Stats(
        s.strength() + 2,
        s.agility() + 2,
        s.intelligence() + 2,
        s.maxHealth() + 20,
        s.maxHealth() + 20, // Full heal on level up
        s.maxMana() + 10,
        s.maxMana() + 10
      );
      character.setStats(upgraded);
    }
  }
}
