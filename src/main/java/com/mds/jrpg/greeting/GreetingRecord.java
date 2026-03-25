package com.mds.jrpg.greeting;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "greetings")
public record GreetingRecord(@Id String id, long counter, String content) {}
