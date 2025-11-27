package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "weather_locations")
public class WeatherLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cityName;
    private String label;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public WeatherLocation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
