const https = require('https');

const terms = ['pushup', 'squat', 'plank', 'bicep curl', 'shoulder press', 'lat pulldown', 'crunches'];

function scrapeTenor(term) {
    return new Promise((resolve) => {
        const url = `https://tenor.com/search/${term.replace(' ', '-')}-gifs`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/https:\/\/media\.tenor\.com\/[^"']+/);
                if (match) {
                    resolve(match[0]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    for (const term of terms) {
        const url = await scrapeTenor(term);
        console.log(`"${term}": "${url}",`);
    }
}
run();
