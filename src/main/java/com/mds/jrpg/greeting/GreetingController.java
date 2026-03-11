package com.mds.jrpg.greeting;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

    private static final String TEMPLATE = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();
    private final GreetingRepository greetingRepository;

    public GreetingController(GreetingRepository greetingRepository) {
        this.greetingRepository = greetingRepository;
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to JRPG API";
    }

    @GetMapping("/greeting")
    public GreetingRecord greeting(
        @RequestParam(defaultValue = "World") String name
    ) {
        GreetingRecord record = new GreetingRecord(
            null,
            counter.incrementAndGet(),
            TEMPLATE.formatted(name)
        );
        return greetingRepository.save(record);
    }
}
