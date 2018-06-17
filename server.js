const Nightmare = require('nightmare')
const express = require('express');

const data = {
    'england': {
        1: {
            'path': 'http://www.livescore.com/soccer/england/premier-league/',
            'standing': [],
            'callback': (result) => {
                data['england'][1]['standing'] = result;
            }
        },
        2: {
            'path': 'http://www.livescore.com/soccer/england/championship/',
            'standing': [],
            'callback': (result) => {
                data['england'][2]['standing'] = result;
            }
        },
        3: {
            'path': 'http://www.livescore.com/soccer/england/league-1/',
            'standing': [],
            'callback': (result) => {
                data['england'][3]['standing'] = result;
            }
        },
        4: {
            'path': 'http://www.livescore.com/soccer/england/league-2/',
            'standing': [],
            'callback': (result) => {
                data['england'][4]['standing'] = result;
            }
        }
    },
    'spain': {
        1: {
            'path': 'http://www.livescore.com/soccer/spain/primera-division/',
            'standing': [],
            'callback': (result) => {
                data['spain'][1]['standing'] = result;
            }
        },
        2: {
            'path': 'http://www.livescore.com/soccer/spain/segunda-division/',
            'standing': [],
            'callback': (result) => {
                data['spain'][2]['standing'] = result;
            }
        }
    },
    'italy': {
        1: {
            'path': 'http://www.livescore.com/soccer/italy/serie-a/',
            'standing': [],
            'callback': (result) => {
                data['italy'][1]['standing'] = result;
            }
        },
        2: {
            'path': 'http://www.livescore.com/soccer/italy/serie-b/',
            'standing': [],
            'callback': (result) => {
                data['italy'][2]['standing'] = result;
            }
        }
    },
    'germany': {
        1: {
            'path': 'http://www.livescore.com/soccer/germany/bundesliga/',
            'standing': [],
            'callback': (result) => {
                data['germany'][1]['standing'] = result;
            }
        },
        2: {
            'path': 'http://www.livescore.com/soccer/germany/2-bundesliga/',
            'standing': [],
            'callback': (result) => {
                data['germany'][2]['standing'] = result;
            }
        }
    },
    'france': {
        1: {
            'path': 'http://www.livescore.com/soccer/france/ligue-1/',
            'standing': [],
            'callback': (result) => {
                data['france'][1]['standing'] = result;
            }
        },
        2: {
            'path': 'http://www.livescore.com/soccer/france/ligue-2/',
            'standing': [],
            'callback': (result) => {
                data['france'][2]['standing'] = result;
            }
        }
    }
}

function set_data(callback, path) {
    Nightmare({ show: false })
        .goto(path)
        .wait('div.ltable:nth-child(3)')
        .evaluate(() => {
            const container = document.querySelector('div.ltable:nth-child(3)');
            const children = container.children;
            const lis = []
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const team = child.querySelector('div[data-type="name"]')
                if (!team) {
                    continue;
                }
                lis.push({
                    'team': team.innerHTML,
                    'played': parseInt(child.querySelector('div[data-type="played"]').innerHTML),
                    'wins': parseInt(child.querySelector('div[data-type="wins"]').innerHTML),
                    'draws': parseInt(child.querySelector('div[data-type="draws"]').innerHTML),
                    'losses': parseInt(child.querySelector('div[data-type="losses"]').innerHTML),
                    'goals_scored': parseInt(child.querySelector('div[data-type="goals-scored"]').innerHTML),
                    'goals_received': parseInt(child.querySelector('div[data-type="goals-received"]').innerHTML),
                    'goal_difference': parseInt(child.querySelector('div[data-type="goal-difference"]').innerHTML),
                    'points': parseInt(child.querySelector('div[data-type="points"]').innerHTML)
                })
            }
            return lis;
        })
        .end()
        .then(r => {
            callback(r);
        })
        .catch(error => {
            console.error('Fail: ', error);
        }
    );
}

function getAll() {
    console.log('fetching');
    for (let k in data) {
        for (let x in data[k]) {
            set_data(data[k][x].callback, data[k][x].path);
        }
    }
}

function _write() {
    
}

getAll();
setInterval(() => {
    getAll();
}, 60000);


const app = express()
app.get('/:nation/:league', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    nation = req.params['nation']
    league = req.params['league']
    if (!nation || !league || !data[nation] || !data[nation][league]) {
        res.statusCode = 404;
        res.send(JSON.stringify('404 - Not Found'))
    } else {
        res.statusCode = 200;
        res.send(JSON.stringify(data[nation][league].standing));
    }
});

app.listen(5050, () => console.log('Running on http://localhost:5050'))
