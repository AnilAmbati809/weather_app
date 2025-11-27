package com.example.backend.repository;

import com.example.backend.entity.WeatherLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeatherLocationRepository extends JpaRepository<WeatherLocation, Long> {

    // used by controller: findByUserUsername(username)
    List<WeatherLocation> findByUserUsername(String username);
}
