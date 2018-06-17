# Livescore scraper
A node.js web service for live standings in soccer leagues.

Note that this is not nor will ever be deployed, since it is in breach of the [terms of use](http://www.livescore.com/terms/) of the livescore app.

# Example data
The following command
```sh
curl --request GET --url http://localhost:5050/england/2'
```
gives the following data
```json
[
    {
        "draws": 9,
        "goal_difference": 43,
        "goals_received": 39,
        "goals_scored": 82,
        "losses": 7,
        "played": 46,
        "points": 99,
        "team": "Wolverhampton Wanderers",
        "wins": 30
    },
    {
        "draws": 9,
        "goal_difference": 30,
        "goals_received": 39,
        "goals_scored": 69,
        "losses": 10,
        "played": 46,
        "points": 90,
        "team": "Cardiff City",
        "wins": 27
    },
    {
        "draws": 13,
        "goal_difference": 33,
        "goals_received": 46,
        "goals_scored": 79,
        "losses": 8,
        "played": 46,
        "points": 88,
        "team": "Fulham",
        "wins": 25
    },
    {
        "draws": 11,
        "goal_difference": 30,
        "goals_received": 42,
        "goals_scored": 72,
        "losses": 11,
        "played": 46,
        "points": 83,
        "team": "Aston Villa",
        "wins": 24
    },
    {
        "draws": 10,
        "goal_difference": 22,
        "goals_received": 45,
        "goals_scored": 67,
        "losses": 14,
        "played": 46,
        "points": 76,
        "team": "Middlesbrough",
        "wins": 22
    },
    {
        "draws": 15,
        "goal_difference": 22,
        "goals_received": 48,
        "goals_scored": 70,
        "losses": 11,
        "played": 46,
        "points": 75,
        "team": "Derby County",
        "wins": 20
    },
    {
        "draws": 16,
        "goal_difference": 11,
        "goals_received": 46,
        "goals_scored": 57,
        "losses": 11,
        "played": 46,
        "points": 73,
        "team": "Preston North End",
        "wins": 19
    },
    {
        "draws": 15,
        "goal_difference": 11,
        "goals_received": 45,
        "goals_scored": 56,
        "losses": 12,
        "played": 46,
        "points": 72,
        "team": "Millwall",
        "wins": 19
    },
    {
        "draws": 15,
        "goal_difference": 10,
        "goals_received": 52,
        "goals_scored": 62,
        "losses": 13,
        "played": 46,
        "points": 69,
        "team": "Brentford",
        "wins": 18
    },
    {
        "draws": 9,
        "goal_difference": 7,
        "goals_received": 55,
        "goals_scored": 62,
        "losses": 17,
        "played": 46,
        "points": 69,
        "team": "Sheffield United",
        "wins": 20
    },
    {
        "draws": 16,
        "goal_difference": 9,
        "goals_received": 58,
        "goals_scored": 67,
        "losses": 13,
        "played": 46,
        "points": 67,
        "team": "Bristol City",
        "wins": 17
    },
    {
        "draws": 9,
        "goal_difference": -3,
        "goals_received": 60,
        "goals_scored": 57,
        "losses": 20,
        "played": 46,
        "points": 60,
        "team": "Ipswich Town",
        "wins": 17
    },
    {
        "draws": 9,
        "goal_difference": -5,
        "goals_received": 64,
        "goals_scored": 59,
        "losses": 20,
        "played": 46,
        "points": 60,
        "team": "Leeds United",
        "wins": 17
    },
    {
        "draws": 15,
        "goal_difference": -11,
        "goals_received": 60,
        "goals_scored": 49,
        "losses": 16,
        "played": 46,
        "points": 60,
        "team": "Norwich City",
        "wins": 15
    },
    {
        "draws": 15,
        "goal_difference": -1,
        "goals_received": 60,
        "goals_scored": 59,
        "losses": 17,
        "played": 46,
        "points": 57,
        "team": "Sheffield Wednesday",
        "wins": 14
    },
    {
        "draws": 11,
        "goal_difference": -12,
        "goals_received": 70,
        "goals_scored": 58,
        "losses": 20,
        "played": 46,
        "points": 56,
        "team": "Queens Park Rangers",
        "wins": 15
    },
    {
        "draws": 8,
        "goal_difference": -14,
        "goals_received": 65,
        "goals_scored": 51,
        "losses": 23,
        "played": 46,
        "points": 53,
        "team": "Nottingham Forest",
        "wins": 15
    },
    {
        "draws": 16,
        "goal_difference": 0,
        "goals_received": 70,
        "goals_scored": 70,
        "losses": 19,
        "played": 46,
        "points": 49,
        "team": "Hull City",
        "wins": 11
    },
    {
        "draws": 7,
        "goal_difference": -30,
        "goals_received": 68,
        "goals_scored": 38,
        "losses": 26,
        "played": 46,
        "points": 46,
        "team": "Birmingham City",
        "wins": 13
    },
    {
        "draws": 14,
        "goal_difference": -22,
        "goals_received": 70,
        "goals_scored": 48,
        "losses": 22,
        "played": 46,
        "points": 44,
        "team": "Reading",
        "wins": 10
    },
    {
        "draws": 13,
        "goal_difference": -35,
        "goals_received": 74,
        "goals_scored": 39,
        "losses": 23,
        "played": 46,
        "points": 43,
        "team": "Bolton Wanderers",
        "wins": 10
    },
    {
        "draws": 14,
        "goal_difference": -24,
        "goals_received": 72,
        "goals_scored": 48,
        "losses": 23,
        "played": 46,
        "points": 41,
        "team": "Barnsley",
        "wins": 9
    },
    {
        "draws": 11,
        "goal_difference": -43,
        "goals_received": 81,
        "goals_scored": 38,
        "losses": 25,
        "played": 46,
        "points": 41,
        "team": "Burton Albion",
        "wins": 10
    },
    {
        "draws": 16,
        "goal_difference": -28,
        "goals_received": 80,
        "goals_scored": 52,
        "losses": 23,
        "played": 46,
        "points": 37,
        "team": "Sunderland",
        "wins": 7
    }
]
```