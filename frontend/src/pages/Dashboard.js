import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 added
import { AuthContext } from "../AuthContext";
import api from "../api";

// 🔑 Put your real OpenWeather API key here
const OPENWEATHER_API_KEY = "c163416529609d282f8a05c49ff4c830";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  // Saved locations (from backend)
  const [locations, setLocations] = useState([]);

  // Search + weather result
  const [searchCity, setSearchCity] = useState("");
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  // Label for "save from search"
  const [saveLabel, setSaveLabel] = useState("");

  // General error at top of page
  const [error, setError] = useState("");

  // ---------- Load saved locations from backend ----------
  const fetchLocations = async () => {
    try {
      console.log("Fetching locations...");
      const res = await api.get("/locations");
      console.log("GET /locations response:", res.data);
      setLocations(res.data || []);
      setError("");
    } catch (err) {
      console.error("GET /locations failed:", err.response || err);
      setError("Failed to load saved locations.");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ---------- Search weather ----------
  const handleSearchWeather = async (e) => {
    e.preventDefault();
    setWeatherError("");
    setWeatherResult(null);
    setError("");

    if (!searchCity.trim()) {
      setWeatherError("Please enter a city name.");
      return;
    }

    try {
      console.log("Searching weather for:", searchCity);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          searchCity
        )}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setWeatherError("City not found. Try another name.");
        } else {
          setWeatherError("Failed to fetch weather. Try again.");
        }
        return;
      }

      const data = await response.json();
      const result = {
        city: data.name,
        country: data.sys?.country,
        temp: data.main?.temp,
        feelsLike: data.main?.feels_like,
        description: data.weather?.[0]?.description,
      };
      console.log("Weather result:", result);
      setWeatherResult(result);
    } catch (err) {
      console.error("Weather API error:", err);
      setWeatherError("Network error while fetching weather.");
    }
  };

  // ---------- Save current searched city ----------
  const handleSaveSearchedLocation = async () => {
    // If no weather result yet, show clear message
    if (!weatherResult || !weatherResult.city) {
      setError("Search a city first, then click Save.");
      return;
    }

    try {
      console.log("Saving location:", {
        cityName: weatherResult.city,
        label: saveLabel || "From search",
        notes: "",
      });

      await api.post("/locations", {
        cityName: weatherResult.city,
        label: saveLabel || "From search",
        notes: "",
      });

      console.log("Save successful, reloading locations...");
      await fetchLocations(); // reload list from backend
      setSaveLabel("");
      setError("");
    } catch (err) {
      console.error("POST /locations failed:", err.response || err);
      setError("Failed to save searched location.");
    }
  };

  // ---------- Delete saved location ----------
  const handleDeleteLocation = async (id) => {
    try {
      console.log("Deleting location with id:", id);
      await api.delete(`/locations/${id}`);
      await fetchLocations();
      setError("");
    } catch (err) {
      console.error("DELETE /locations failed:", err.response || err);
      setError("Failed to delete location.");
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <header className="dashboard-header">
          <div>
            <div className="badge">Weather App</div>
            <h2 className="dashboard-title">
              {user?.role === "ROLE_ADMIN" ? "Admin Dashboard" : "Search & Save Locations"}
            </h2>
            <p className="card-subtitle">
              {user?.role === "ROLE_ADMIN"
                ? "As admin, you can manage all users and also use the weather app."
                : "Search temperature for any city and keep a list of your favourites."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {user?.role === "ROLE_ADMIN" && (
              <Link to="/admin" className="btn btn-outline">
                Admin Panel
              </Link>
            )}

            <div className="user-chip">
              <span>👤</span>
              <span>{user?.username}</span>
            </div>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {error && <p className="text-error">{error}</p>}

        <div className="dashboard-grid">
          {/* LEFT: search + save */}
          <section className="section">
            <div className="section-header">
              <h3 className="section-title">Search weather by city</h3>
            </div>

            <form className="search-form" onSubmit={handleSearchWeather}>
              <input
                className="input"
                placeholder="Enter city (e.g., Hyderabad)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>

            {weatherError && <p className="text-error">{weatherError}</p>}

            {weatherResult && (
              <div className="weather-card">
                <div className="weather-city">
                  {weatherResult.city}
                  {weatherResult.country && `, ${weatherResult.country}`}
                </div>
                <div className="weather-temp">
                  {Math.round(weatherResult.temp)}°C
                </div>
                {weatherResult.description && (
                  <div className="weather-desc">
                    {weatherResult.description}
                  </div>
                )}
                {weatherResult.feelsLike !== undefined && (
                  <p className="text-muted">
                    Feels like: {Math.round(weatherResult.feelsLike)}°C
                  </p>
                )}

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    className="input"
                    style={{ flex: "1 1 180px" }}
                    placeholder="Optional label (Home, Office...)"
                    value={saveLabel}
                    onChange={(e) => setSaveLabel(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSaveSearchedLocation}
                  >
                    Save location
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: saved locations list only */}
          <section className="section">
            <div className="section-header">
              <h3 className="section-title">Saved locations</h3>
            </div>

            <ul className="locations-list">
              {locations.length === 0 ? (
                <p className="text-muted" style={{ marginTop: "8px" }}>
                  No saved locations yet.
                </p>
              ) : (
                locations.map((loc) => (
                  <li key={loc.id} className="location-item">
                    <div className="location-main">
                      <span className="location-title">
                        {loc.cityName} {loc.label && `(${loc.label})`}
                      </span>
                      {loc.notes && (
                        <span className="location-sub">{loc.notes}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDeleteLocation(loc.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
