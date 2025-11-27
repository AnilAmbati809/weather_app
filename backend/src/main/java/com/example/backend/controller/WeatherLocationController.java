package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.WeatherLocation;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WeatherLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "http://localhost:3000")
public class WeatherLocationController {

    @Autowired
    private WeatherLocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<WeatherLocation> getMyLocations(Authentication auth) {
        String username = auth.getName();
        return locationRepository.findByUserUsername(username);
    }

    @PostMapping
    public WeatherLocation addLocation(@RequestBody WeatherLocation location,
                                       Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        location.setUser(user);
        return locationRepository.save(location);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeatherLocation> updateLocation(
            @PathVariable Long id,
            @RequestBody WeatherLocation updated,
            Authentication auth) {

        String username = auth.getName();

        Optional<WeatherLocation> existingOpt = locationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WeatherLocation existing = existingOpt.get();
        if (!existing.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        existing.setCityName(updated.getCityName());
        existing.setLabel(updated.getLabel());
        existing.setNotes(updated.getNotes());

        WeatherLocation saved = locationRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id,
                                            Authentication auth) {

        String username = auth.getName();

        Optional<WeatherLocation> existingOpt = locationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WeatherLocation existing = existingOpt.get();
        if (!existing.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        locationRepository.delete(existing);
        return ResponseEntity.ok().build();
    }
}
