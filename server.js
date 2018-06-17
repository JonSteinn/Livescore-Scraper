/**
 * An api that returns live soccer league standings.
 * It does so by scraping livescore every 60 seconds.
 * To avoid concurrent access to our data by the
 * update every 60 sec and any client, we use
 * semaphores. The approach would technically starve
 * readers but since we are the only writer, which
 * only happens every 60 seconds, that is fine.
 * Each league has its own semaphore so we are not
 * locking people reading one leaegue if we are
 * only updating another.
 */

const Nightmare = require('nightmare')
const express = require('express');
const Semaphore = require('semaphore')

/**
 * In memory data for each league.
 */
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

/**
 * Write the updated tables to our data.
 * 
 * @param {object} obj The league data
 * @param {object} result The scraping results
 */
function writeData(obj, result) {
    // Start writer

    // Start writer mutex
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
        // End writer mutex

        obj.resource.take(1, () => {

            // Start critical section
            obj['standing'] = result;
            // End critical section

            obj.resource.leave();

            // Start writer mutex
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
        // End writer mutex
    }
}

/**
 * Scrapes tables from Livescore.
 * 
 * @param {function} callback What is called with the result when finsihed
 * @param {string} path The uri of the site to request
 */
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

/**
 * Fetches all the leagues asynchronously.
 */
function getAll() {
    for (let k in data) {
        for (let x in data[k]) {
            set_data(data[k][x].callback, data[k][x].path);
        }
    }
}

/*
 * Start by getting all the data from livescore
 * and then fetch it every 60 seconds.
 */
getAll();
setInterval(() => {
    getAll();
}, 60000);

// Create a Express app
const app = express();

/**
 * GET /:nation/:league
 * 
 * Returns a json array, ordered by the league standing
 * with every team as an object in the array and status
 * code 200 if the league is supported, 404 otherwise.
 */
app.get('/:nation/:league', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    nation = req.params['nation'].toLowerCase();
    league = req.params['league'].toLowerCase();

    if (!nation || !league || !data[nation] || !data[nation][league]) {
        res.statusCode = 404;
        // Construct a json object of supported leagues from data object
        const supportedLeagues = {};
        for (nation in data) {
            supportedLeagues[nation] = [];
            for (league in data[nation]) {
                supportedLeagues[nation].push(league);
            }
        }
        res.send(JSON.stringify({'supported leagues': supportedLeagues}));
    } else {
        res.statusCode = 200;

        // Start reader
        data[nation][league].readTry.take(1, () => {
            // Start reading mutex
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
            // End reading mutex
            data[nation][league].rMutex.leave();
            data[nation][league].readTry.leave();
            
            // Start critical section
            res.send(JSON.stringify(data[nation][league].standing));
            // End critical section

            // Start reading mutex
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
            // End reading mutex
            data[nation][league].rMutex.leave();

            // End reader
        }     
    }
});

// Listen on port 5050
app.listen(5050, () => console.log('Running on http://localhost:5050'));