package com.mds.jrpg.item.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MongoDB Document representing an Item in the JRPG.
 * Items can be weapons, armor, or consumables and provide stat bonuses.
 */
@Document(collection = "items")
public class Item {

    @Id
    private String id;
    private String name;
    private ItemType type;
    private int strengthBonus;
    private int agilityBonus;
    private int intelligenceBonus;
    private int healthBonus;
    private int manaBonus;

    public Item() {}

    public Item(String name, ItemType type, int strengthBonus, int agilityBonus, int intelligenceBonus, int healthBonus, int manaBonus) {
        this.name = name;
        this.type = type;
        this.strengthBonus = strengthBonus;
        this.agilityBonus = agilityBonus;
        this.intelligenceBonus = intelligenceBonus;
        this.healthBonus = healthBonus;
        this.manaBonus = manaBonus;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }

    public int getStrengthBonus() { return strengthBonus; }
    public void setStrengthBonus(int strengthBonus) { this.strengthBonus = strengthBonus; }

    public int getAgilityBonus() { return agilityBonus; }
    public void setAgilityBonus(int agilityBonus) { this.agilityBonus = agilityBonus; }

    public int getIntelligenceBonus() { return intelligenceBonus; }
    public void setIntelligenceBonus(int intelligenceBonus) { this.intelligenceBonus = intelligenceBonus; }

    public int getHealthBonus() { return healthBonus; }
    public void setHealthBonus(int healthBonus) { this.healthBonus = healthBonus; }

    public int getManaBonus() { return manaBonus; }
    public void setManaBonus(int manaBonus) { this.manaBonus = manaBonus; }
}
