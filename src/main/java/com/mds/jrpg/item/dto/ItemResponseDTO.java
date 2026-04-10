package com.mds.jrpg.item.dto;

import com.mds.jrpg.item.model.ItemType;

/**
 * Data Transfer Object for sending item information to the client.
 * Provides a structured and safe representation of the Item document.
 */
public record ItemResponseDTO(
  String id,
  String name,
  ItemType type,
  int strengthBonus,
  int agilityBonus,
  int intelligenceBonus,
  int healthBonus,
  int manaBonus
) {}
