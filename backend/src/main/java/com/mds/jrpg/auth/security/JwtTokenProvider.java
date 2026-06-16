package com.mds.jrpg.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

/**
 * JWT Token Provider for generating and validating JWT tokens.
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:your-secret-key-change-in-production-environment-please}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    /**
     * Generate a JWT token for a given username.
     *
     * @param username the username to encode in the token
     * @return the generated JWT token
     */
    public String generateToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Instant now = Instant.now();
        Instant expiryTime = now.plusMillis(jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiryTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract username from JWT token.
     *
     * @param token the JWT token
     * @return the username encoded in the token
     */
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /**
     * Validate JWT token.
     *
     * @param token the JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get token expiration time in milliseconds.
     *
     * @return the expiration time in milliseconds
     */
    public long getExpirationTime() {
        return jwtExpirationMs;
    }
}
