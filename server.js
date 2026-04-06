const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'fitness-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Serve static files from the current directory (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

let db;

async function initializeDB() {
    db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    // Create Tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            water INTEGER DEFAULT 0,
            steps INTEGER DEFAULT 0,
            total_workouts INTEGER DEFAULT 0,
            total_time INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    console.log('Connected to the SQLite database.');
}

// Ensure Auth Middleware
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ==== AUTH ROUTES ====

app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Invalid email or password too short.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        // Initialize metrics for the new user
        await db.run('INSERT INTO metrics (user_id) VALUES (?)', [result.lastID]);

        req.session.userId = result.lastID;
        req.session.email = email;
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        if (error.message.includes('FOREIGN KEY') || error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.email = user.email;
        res.json({ message: 'Logged in' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, email: req.session.email });
    } else {
        res.json({ loggedIn: false });
    }
});

// ==== METRICS ROUTES ====

app.get('/api/metrics', requireAuth, async (req, res) => {
    try {
        const metrics = await db.get('SELECT * FROM metrics WHERE user_id = ?', [req.session.userId]);
        res.json(metrics || { water: 0, steps: 0, total_workouts: 0, total_time: 0 });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/metrics', requireAuth, async (req, res) => {
    const { water, steps, totalWorkouts, totalTime } = req.body;
    try {
        let updateParts = [];
        let params = [];

        if (water !== undefined) { updateParts.push("water = ?"); params.push(water); }
        if (steps !== undefined) { updateParts.push("steps = ?"); params.push(steps); }
        if (totalWorkouts !== undefined) { updateParts.push("total_workouts = ?"); params.push(totalWorkouts); }
        if (totalTime !== undefined) { updateParts.push("total_time = ?"); params.push(totalTime); }

        if (updateParts.length > 0) {
            params.push(req.session.userId);
            await db.run(`UPDATE metrics SET ${updateParts.join(", ")} WHERE user_id = ?`, params);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// ==== PLANS ROUTES ====

app.get('/api/plans', requireAuth, async (req, res) => {
    try {
        const plans = await db.all('SELECT data FROM plans WHERE user_id = ?', [req.session.userId]);
        res.json(plans.map(p => JSON.parse(p.data)));
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/plans', requireAuth, async (req, res) => {
    try {
        const plans = req.body; 
        await db.run('DELETE FROM plans WHERE user_id = ?', [req.session.userId]);

        if (Array.isArray(plans)) {
            for (const plan of plans) {
                await db.run('INSERT INTO plans (user_id, data) VALUES (?, ?)', [req.session.userId, JSON.stringify(plan)]);
            }
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/plans/active', requireAuth, async (req, res) => {
    req.session.activePlan = req.body;
    res.json({ success: true });
});
app.get('/api/plans/active', requireAuth, async (req, res) => {
    res.json(req.session.activePlan || null);
});
app.delete('/api/plans/active', requireAuth, async (req, res) => {
    req.session.activePlan = null;
    res.json({ success: true });
});

// ==== HISTORY ROUTES ====

app.get('/api/history', requireAuth, async (req, res) => {
    try {
        const h = await db.all('SELECT data FROM history WHERE user_id = ?', [req.session.userId]);
        res.json(h.map(row => JSON.parse(row.data)));
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/history', requireAuth, async (req, res) => {
    try {
        const historyData = req.body;
        if(Array.isArray(historyData)){
             await db.run('DELETE FROM history WHERE user_id = ?', [req.session.userId]);
             for(const entry of historyData){
                 await db.run('INSERT INTO history (user_id, data) VALUES (?, ?)', [req.session.userId, JSON.stringify(entry)]);
             }
        } else {
            // Unused by frontend right now but good to have
            await db.run('INSERT INTO history (user_id, data) VALUES (?, ?)', [req.session.userId, JSON.stringify(historyData)]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
app.delete('/api/history', requireAuth, async (req, res) => {
    try {
        await db.run('DELETE FROM history WHERE user_id = ?', [req.session.userId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
