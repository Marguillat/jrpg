package com.mds.jrpg.common.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Root controller for the JRPG API.
 * Provides information about available routes and endpoints.
 */
@RestController
@RequestMapping({"/", "/api"})
public class RootController {

  /**
   * Endpoint to retrieve all available API routes.
   *
   * @return A detailed list of all available endpoints with their HTTP methods and descriptions.
   */
  @GetMapping
  public ResponseEntity<?> listRoutes() {
    Map<String, Object> apiInfo = Map.of(
      "name",
      "JavaRPG API",
      "version",
      "1.0.0",
      "description",
      "A REST API for a JRPG (Japanese Role Playing Game) built with Spring Boot and MongoDB",
      "baseUrl",
      "http://localhost:8080",
      "resources",
      List.of(
        Map.of(
          "name",
          "Characters",
          "description",
          "Manage game characters (heroes)",
          "endpoints",
          List.of(
            Map.of(
              "method",
              "GET",
              "path",
              "/api/characters",
              "description",
              "List all characters"
            ),
            Map.of(
              "method",
              "POST",
              "path",
              "/api/characters",
              "description",
              "Create a new character"
            ),
            Map.of(
              "method",
              "GET",
              "path",
              "/api/characters/{id}",
              "description",
              "Get a specific character"
            ),
            Map.of(
              "method",
              "DELETE",
              "path",
              "/api/characters/{id}",
              "description",
              "Delete a character"
            ),
            Map.of(
              "method",
              "OPTIONS",
              "path",
              "/api/characters",
              "description",
              "Get metadata and parameters for character resource"
            )
          )
        ),
        Map.of(
          "name",
          "Items",
          "description",
          "Manage items and equipment",
          "endpoints",
          List.of(
            Map.of(
              "method",
              "GET",
              "path",
              "/api/items",
              "description",
              "List all items"
            ),
            Map.of(
              "method",
              "POST",
              "path",
              "/api/items",
              "description",
              "Create a new item"
            ),
            Map.of(
              "method",
              "GET",
              "path",
              "/api/items/{id}",
              "description",
              "Get a specific item"
            ),
            Map.of(
              "method",
              "POST",
              "path",
              "/api/items/{itemId}/equip/{characterId}",
              "description",
              "Equip an item to a character"
            ),
            Map.of(
              "method",
              "OPTIONS",
              "path",
              "/api/items",
              "description",
              "Get metadata and parameters for item resource"
            )
          )
        ),
        Map.of(
          "name",
          "Monsters",
          "description",
          "Manage monsters and bestiary",
          "endpoints",
          List.of(
            Map.of(
              "method",
              "GET",
              "path",
              "/api/monsters",
              "description",
              "List all monsters"
            ),
            Map.of(
              "method",
              "POST",
              "path",
              "/api/monsters",
              "description",
              "Create a new monster"
            ),
            Map.of(
              "method",
              "GET",
              "path",
              "/api/monsters/{id}",
              "description",
              "Get a specific monster"
            ),
            Map.of(
              "method",
              "DELETE",
              "path",
              "/api/monsters/{id}",
              "description",
              "Delete a monster"
            ),
            Map.of(
              "method",
              "OPTIONS",
              "path",
              "/api/monsters",
              "description",
              "Get metadata and parameters for monster resource"
            )
          )
        ),
        Map.of(
          "name",
          "Battles",
          "description",
          "Manage battles and combat",
          "endpoints",
          List.of(
            Map.of(
              "method",
              "POST",
              "path",
              "/api/battles/start",
              "description",
              "Start an automated battle between a character and a monster"
            ),
            Map.of(
              "method",
              "OPTIONS",
              "path",
              "/api/battles",
              "description",
              "Get metadata and parameters for battle resource"
            )
          )
        )
      ),
      "documentation",
      "For detailed information about each resource, send an OPTIONS request to the resource path"
    );

    return ResponseEntity.ok(apiInfo);
  }

  /**
   * Provides metadata about available routes.
   * Describes the allowed methods and available resources.
   *
   * @return A map containing API metadata and information.
   */
  @RequestMapping(method = RequestMethod.OPTIONS)
  public ResponseEntity<?> options() {
    Map<String, Object> metadata = Map.of(
      "resource",
      "API Root",
      "allowedMethods",
      Set.of(HttpMethod.GET, HttpMethod.OPTIONS),
      "description",
      "The root endpoint provides access to all available API resources",
      "availableAt",
      List.of("/", "/api"),
      "documentation",
      Map.of(
        "readme",
        "Check the README.md for detailed API documentation",
        "getRoutes",
        "Send a GET request to / or /api to list all available routes",
        "resourceMetadata",
        "Send an OPTIONS request to any resource path to get its metadata"
      )
    );

    return ResponseEntity.ok()
      .allow(HttpMethod.GET, HttpMethod.OPTIONS)
      .body(metadata);
  }
}
