package com.mds.jrpg.battle.controller;

import com.mds.jrpg.battle.dto.BattleRequestDTO;
import com.mds.jrpg.battle.dto.BattleResultDTO;
import com.mds.jrpg.battle.service.BattleService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing battles in the JRPG.
 * Provides endpoints to trigger combat between characters and monsters.
 */
@RestController
@RequestMapping("/api/battles")
public class BattleController {

  private final BattleService battleService;

  public BattleController(BattleService battleService) {
    this.battleService = battleService;
  }

  /**
   * Endpoint to start an automated turn-based battle.
   *
   * @param request Contains characterId and monsterId.
   * @return A detailed result of the combat including logs and rewards.
   */
  @PostMapping("/start")
  public ResponseEntity<BattleResultDTO> startBattle(
    @RequestBody BattleRequestDTO request
  ) {
    BattleResultDTO result = battleService.startBattle(request);
    return ResponseEntity.ok(result);
  }

  /**
   * Provides metadata about the Battle resource.
   * Describes the required parameters for starting a combat.
   *
   * @return A map containing API usage information.
   */
  @RequestMapping(method = RequestMethod.OPTIONS)
  public ResponseEntity<?> options() {
    Map<String, Object> metadata = Map.of(
      "resource",
      "Battles",
      "allowedMethods",
      Set.of(HttpMethod.POST, HttpMethod.OPTIONS),
      "postParameters",
      Map.of(
        "characterId",
        "String (required) - ID of the hero",
        "monsterId",
        "String (required) - ID of the monster to fight"
      ),
      "endpoints",
      List.of(
        Map.of(
          "path",
          "/api/battles/start",
          "method",
          "POST",
          "description",
          "Triggers a turn-based combat and returns the log and rewards"
        )
      )
    );

    return ResponseEntity.ok()
      .allow(HttpMethod.POST, HttpMethod.OPTIONS)
      .body(metadata);
  }
}
