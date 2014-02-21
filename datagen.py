""" generate data
"""

import json
from random import choice
import datetime
from datetime import date
from datetime import datetime

data = []

users = ['Wei', 'Kavin', 'Grant']

activities = """
Basketball
Beach Volleyball
Biking
Boot Camp
Circuit Training
Dance Revolution
Elliptical Trainer
Family Hike
Field Hockey
Football
Half Marathon
Handball
Hockey
Ice Hockey
Ice Skating
In-line Skating
""".strip().split('\n')


for i in range(100):
    """generate 100 entries
    """
    entry = {}
    entry['task'] = choice(activities)
    entry['user'] = choice(users)
    year = 2014
    month = choice(range(1,3))
    day = choice(range(1, 28))
    hours = choice(range(6, 20))
    minutes = choice(range(0, 60))
    seconds = choice(range(0, 60))
    entry['from'] = datetime(year, month, day, hours, minutes, seconds).isoformat()
    entry['to'] = datetime(year, month, day, hours + choice(range(3)), choice(range(0,60)), choice(range(0,60))).isoformat()
    data.append(entry)

print json.dumps(data)
