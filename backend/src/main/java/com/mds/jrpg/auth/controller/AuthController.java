package com.mds.jrpg.auth.controller;

import com.mds.jrpg.auth.dto.AuthLoginRequest;
import com.mds.jrpg.auth.dto.AuthRegisterRequest;
import com.mds.jrpg.auth.dto.AuthResponse;
import com.mds.jrpg.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * OPTIONS endpoint for /api/auth - returns metadata about auth endpoints.
     */
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> optionsAuth() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("resource", "Authentication");
        metadata.put("allowedMethods", new String[]{"POST", "OPTIONS"});

        Map<String, Object> postParameters = new HashMap<>();

        // Register endpoint
        Map<String, Object> registerParams = new HashMap<>();
        registerParams.put("username", "string (min 3 chars, unique)");
        registerParams.put("password", "string (min 4 chars)");
        registerParams.put("confirmPassword", "string (must match password)");

        // Login endpoint
        Map<String, Object> loginParams = new HashMap<>();
        loginParams.put("username", "string");
        loginParams.put("password", "string");

        postParameters.put("register", registerParams);
        postParameters.put("login", loginParams);
        metadata.put("postParameters", postParameters);

        return ResponseEntity.ok(metadata);
    }

    /**
     * Register a new user.
     * POST /api/auth/register
     *
     * @param request the registration request
     * @return the authentication response with JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login user.
     * POST /api/auth/login
     *
     * @param request the login request
     * @return the authentication response with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthLoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout user.
     * POST /api/auth/logout
     * Note: JWT tokens are stateless, so logout is primarily for client-side cleanup.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Déconnexion réussie");
        return ResponseEntity.ok(response);
    }
}
