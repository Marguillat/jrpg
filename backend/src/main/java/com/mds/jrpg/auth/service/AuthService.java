package com.mds.jrpg.auth.service;

import com.mds.jrpg.auth.dto.AuthLoginRequest;
import com.mds.jrpg.auth.dto.AuthRegisterRequest;
import com.mds.jrpg.auth.dto.AuthResponse;
import com.mds.jrpg.auth.model.User;
import com.mds.jrpg.auth.repository.UserRepository;
import com.mds.jrpg.auth.security.JwtTokenProvider;
import com.mds.jrpg.common.exception.BadRequestException;
import com.mds.jrpg.common.exception.ConflictException;
import com.mds.jrpg.common.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for user authentication (registration, login, token validation).
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Register a new user.
     *
     * @param request the registration request containing username and password
     * @return the authentication response with JWT token
     * @throws BadRequestException if validation fails
     * @throws ConflictException if username already exists
     */
    public AuthResponse register(AuthRegisterRequest request) {
        // Validate request
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Le nom d'utilisateur ne peut pas être vide");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Le mot de passe ne peut pas être vide");
        }
        if (request.getUsername().length() < 3) {
            throw new BadRequestException("Le nom d'utilisateur doit contenir au moins 3 caractères");
        }
        if (request.getPassword().length() < 4) {
            throw new BadRequestException("Le mot de passe doit contenir au moins 4 caractères");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Les mots de passe ne correspondent pas");
        }

        // Check if username already exists
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            throw new ConflictException("Le nom d'utilisateur '" + request.getUsername() + "' est déjà utilisé");
        }

        // Create new user
        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getUsername(), passwordHash);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getUsername());
        long expiresIn = jwtTokenProvider.getExpirationTime();

        return new AuthResponse(token, user.getUsername(), expiresIn);
    }

    /**
     * Authenticate user and generate JWT token.
     *
     * @param request the login request containing username and password
     * @return the authentication response with JWT token
     * @throws UnauthorizedException if credentials are invalid
     */
    public AuthResponse login(AuthLoginRequest request) {
        // Validate request
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Le nom d'utilisateur ne peut pas être vide");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Le mot de passe ne peut pas être vide");
        }

        // Find user by username
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("Nom d'utilisateur ou mot de passe invalide");
        }

        User user = userOptional.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Nom d'utilisateur ou mot de passe invalide");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getUsername());
        long expiresIn = jwtTokenProvider.getExpirationTime();

        return new AuthResponse(token, user.getUsername(), expiresIn);
    }

    /**
     * Get user by username.
     *
     * @param username the username to search for
     * @return the user if found
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Validate JWT token.
     *
     * @param token the JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    /**
     * Get username from JWT token.
     *
     * @param token the JWT token
     * @return the username
     */
    public String getUsernameFromToken(String token) {
        return jwtTokenProvider.getUsernameFromToken(token);
    }
}
