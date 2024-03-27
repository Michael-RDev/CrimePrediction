import requests

def find_location_from_location(lattitude, longitude):
    api_url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        'format': 'json',
        'lat': lattitude,
        'lon': longitude,
        'zoom': 14,
        'addressdetails': 1
    }
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        data = response.json()
        data = data["display_name"]
        return data
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
