const https = require('https');

const terms = ['pushup', 'squat', 'plank', 'bicep curl', 'shoulder press'];

function searchGiphy(term) {
    return new Promise((resolve) => {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(term + ' fitness')}&limit=1`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.data && parsed.data[0]) {
                        resolve(parsed.data[0].images.downsized.url);
                    } else {
                        resolve(null);
                    }
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    for (const term of terms) {
        const url = await searchGiphy(term);
        console.log(`${term}: ${url}`);
    }
}
run();
