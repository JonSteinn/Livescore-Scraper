const Nightmare = require('nightmare')
const express = require('express');
var Semaphore = require('semaphore')

const data = {
    'england': {
        1: {
            'path': 'http://www.livescore.com/soccer/england/premier-league/',
            'standing': [],
            'callback': (result) => {
                writeData(data['england'][1], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        2: {
            'path': 'http://www.livescore.com/soccer/england/championship/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['england'][2], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        3: {
            'path': 'http://www.livescore.com/soccer/england/league-1/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['england'][3], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        4: {
            'path': 'http://www.livescore.com/soccer/england/league-2/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['england'][4], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        }
    },
    'spain': {
        1: {
            'path': 'http://www.livescore.com/soccer/spain/primera-division/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['spain'][1], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        2: {
            'path': 'http://www.livescore.com/soccer/spain/segunda-division/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['spain'][2], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        }
    },
    'italy': {
        1: {
            'path': 'http://www.livescore.com/soccer/italy/serie-a/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['italy'][1], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        2: {
            'path': 'http://www.livescore.com/soccer/italy/serie-b/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['italy'][2], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        }
    },
    'germany': {
        1: {
            'path': 'http://www.livescore.com/soccer/germany/bundesliga/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['germany'][1], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        2: {
            'path': 'http://www.livescore.com/soccer/germany/2-bundesliga/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['germany'][2], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        }
    },
    'france': {
        1: {
            'path': 'http://www.livescore.com/soccer/france/ligue-1/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['france'][1], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        },
        2: {
            'path': 'http://www.livescore.com/soccer/france/ligue-2/',
            'standing': [],
            'temp_standing': [],
            'callback': (result) => {
                writeData(data['france'][2], result);
            },
            'readCount': 0,
            'writeCount': 0,
            'rMutex': Semaphore(1),
            'wMutex': Semaphore(1),
            'readTry': Semaphore(1),
            'resource': Semaphore(1)
        }
    }
}

function writeData(obj, result) {
    obj.wMutex.take(1, () => {
        obj.writeCount++;
        if (obj.writeCount === 1) {
            obj.readTry.take(1, step2);
        } else {
            step2();
        }
    })
    function step2() {
        obj.wMutex.leave();
        obj.resource.take(1, () => {
            obj['standing'] = result;
            obj.resource.leave();
            obj.wMutex.take(1, () => {
                obj.writeCount--;
                if (obj.writeCount === 0) {
                    obj.readTry.leave();
                    step3();
                } else {
                    step3();
                }
            })
        });
    }
    function step3() {
        obj.wMutex.leave();
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
    for (let k in data) {
        for (let x in data[k]) {
            set_data(data[k][x].callback, data[k][x].path);
        }
    }
}


getAll();
setInterval(() => {
    getAll();
}, 60000);

const app = express();

app.get('/:nation/:league', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    nation = req.params['nation']
    league = req.params['league']
    if (!nation || !league || !data[nation] || !data[nation][league]) {
        res.statusCode = 404;
        res.send(JSON.stringify('404 - Not Found'))
    } else {
        res.statusCode = 200;

        data[nation][league].readTry.take(1, () => {
            data[nation][league].rMutex.take(1, () => {
                data[nation][league].readCount++;
                if (data[nation][league].readCount === 1) {
                    data[nation][league].resource.take(1, step2);
                } else {
                    step2();
                }
            })
        })
        function step2() {
            data[nation][league].rMutex.leave();
            data[nation][league].readTry.leave();
            res.send(JSON.stringify(data[nation][league].standing));
            data[nation][league].rMutex.take(1, () => {
                data[nation][league].readCount--;
                if (data[nation][league].readCount === 0) {
                    data[nation][league].resource.leave();
                    step3();
                } else {
                    step3();
                }
            })
        }
        function step3() {
            data[nation][league].rMutex.leave();
        }     
    }
});

app.listen(5050, () => console.log('Running on http://localhost:5050'));