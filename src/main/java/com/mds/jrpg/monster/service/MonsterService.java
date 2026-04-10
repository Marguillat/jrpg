package com.mds.jrpg.monster.service;

import com.mds.jrpg.common.exception.ResourceNotFoundException;
import com.mds.jrpg.monster.dto.MonsterRequestDTO;
import com.mds.jrpg.monster.dto.MonsterResponseDTO;
import com.mds.jrpg.monster.model.Monster;
import com.mds.jrpg.monster.repository.MonsterRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class handling the business logic for Monsters.
 * Responsible for bestiary management including creation, retrieval, and deletion of monsters.
 */
@Service
public class MonsterService {

  private final MonsterRepository monsterRepository;

  public MonsterService(MonsterRepository monsterRepository) {
    this.monsterRepository = monsterRepository;
  }

  /**
   * Creates a new monster in the bestiary.
   *
   * @param request The monster creation request DTO.
   * @return The created monster as a response DTO.
   * @throws IllegalArgumentException if a monster with the same name already exists.
   */
  @Transactional
  public MonsterResponseDTO createMonster(MonsterRequestDTO request) {
    if (monsterRepository.existsByName(request.name())) {
      throw new IllegalArgumentException(
        "Monster with name '" + request.name() + "' already exists."
      );
    }

    Monster monster = new Monster(
      request.name(),
      request.level(),
      request.stats(),
      request.experienceValue()
    );

    Monster savedMonster = monsterRepository.save(monster);
    return mapToResponseDTO(savedMonster);
  }

  /**
   * Retrieves all monsters from the bestiary.
   *
   * @return A list of monster response DTOs.
   */
  public List<MonsterResponseDTO> getAllMonsters() {
    return monsterRepository
      .findAll()
      .stream()
      .map(this::mapToResponseDTO)
      .collect(Collectors.toList());
  }

  /**
   * Retrieves a specific monster by its ID.
   *
   * @param id The unique identifier of the monster.
   * @return The monster response DTO.
   * @throws ResourceNotFoundException if no monster is found.
   */
  public MonsterResponseDTO getMonsterById(String id) {
    Monster monster = monsterRepository
      .findById(id)
      .orElseThrow(() ->
        new ResourceNotFoundException("Monster not found with id: " + id)
      );
    return mapToResponseDTO(monster);
  }

  /**
   * Deletes a monster from the bestiary.
   *
   * @param id The unique identifier of the monster to delete.
   * @throws ResourceNotFoundException if no monster is found.
   */
  public void deleteMonster(String id) {
    if (!monsterRepository.existsById(id)) {
      throw new ResourceNotFoundException("Monster not found with id: " + id);
    }
    monsterRepository.deleteById(id);
  }

  /**
   * Maps a Monster entity to a MonsterResponseDTO.
   */
  private MonsterResponseDTO mapToResponseDTO(Monster monster) {
    return new MonsterResponseDTO(
      monster.getId(),
      monster.getName(),
      monster.getLevel(),
      monster.getStats(),
      monster.getExperienceValue()
    );
  }
}
