var express = require('express');
const fetch = require('node-fetch');
var app = express();

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', function(req, res) {
        res.render('stats');
});

app.post('/api/get-data', async (req, res) => {
    const { username, platform } = req.body;

    const url = `https://fortnite-api.com/v1/stats/br/v2/?name=${username}`;
    const options = { method: "GET" };

    try {
        var result = await fetch(url, options)
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            });

        if (result.status === 404) {
            return res.json({ status: 'error', error: "This username doesn't exist. Please try another username." });
        }

        var profile = result['data']['stats'][platform];

        if (!profile) {
            return res.json({ status: 'error', error: 'There are no account stats for this platform. Please try again with a different platform.' });
        }

        for (mode in profile) { 
            if (!profile[mode]) {
                profile[mode] = { isPlayed: false };
            } else {
                profile[mode].isPlayed = true;
            }
        }
    } catch (error) {
        return res.json({ status: 'error', error: 'Unable to obtain data. Please try again with a different account or platform.' });
    }

    res.json({ status: 'ok', profile });
});

app.listen(port);





