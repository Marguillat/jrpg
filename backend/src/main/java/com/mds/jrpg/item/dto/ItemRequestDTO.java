package com.mds.jrpg.item.dto;

import com.mds.jrpg.item.model.ItemType;

/**
 * Data Transfer Object for creating or updating an Item.
 * Contains the necessary fields and validation for item initialization.
 */
public record ItemRequestDTO(
  String name,
  ItemType type,
  int strengthBonus,
  int agilityBonus,
  int intelligenceBonus,
  int healthBonus,
  int manaBonus
) {}
