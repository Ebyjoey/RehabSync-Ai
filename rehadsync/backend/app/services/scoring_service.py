def calculate_score(data: dict) -> int:
    squats = data.get("squats", 0)
    jumps = data.get("jumps", 0)
    distance = data.get("distance_km", 0)

    score = squats * 5 + jumps * 3 + int(distance * 10)
    return score