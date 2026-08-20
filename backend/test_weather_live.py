import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from location.location_service import search_locations, reverse_geocode
from weather.weather_service import get_weather_data

def run_tests():
    print("Testing Location Search...")
    locs = search_locations("Kolar, Karnataka")
    assert len(locs) > 0, "Location search returned 0 results"
    first = locs[0]
    print(f"Found location: {first['formatted_location']}, lat: {first['lat']}, lon: {first['lon']}")

    print("\nTesting Live Weather...")
    w = get_weather_data(location="Kolar, Karnataka", lat=first["lat"], lon=first["lon"], crop="Paddy")
    assert "current" in w, "Current weather missing"
    assert "agricultural_advisory" in w, "Agricultural advisory missing"
    curr = w["current"]
    ag = w["agricultural_advisory"]
    print(f"Temp: {curr['temp']} °C")
    print(f"Feels like: {curr['feels_like']} °C")
    print(f"Condition: {curr['condition']}")
    print(f"Humidity: {curr['humidity']}%")
    print(f"Wind Speed: {curr['wind_speed']} km/h")
    print(f"Precipitation: {curr['precipitation']} mm")
    print(f"Cloud Cover: {curr['cloud_cover']}%")
    print(f"Updated At: {curr['updated_at']}")
    print(f"Disease Risk: {ag['disease_risk']}")
    print(f"Spraying Suitable: {ag['suitable_for_spraying']}")
    print(f"Spraying Advisory: {ag['spraying_advisory']}")
    print(f"Crop: {ag['crop']}")
    print(f"5-day forecast items: {len(w.get('forecast', []))}")
    print("\nALL BACKEND WEATHER & GEOCODING TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
