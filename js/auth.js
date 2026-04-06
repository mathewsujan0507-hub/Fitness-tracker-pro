let coreUserEmail = null;

function normalizeEmail(email){
    return String(email || "").trim().toLowerCase();
}

function getCurrentUserEmail(){
    return coreUserEmail;
}

function isLoggedIn(){
    return Boolean(coreUserEmail);
}

async function checkAuthStatus() {
    try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        coreUserEmail = data.loggedIn ? data.email : null;
    } catch(e) {
        coreUserEmail = null;
    }
}

async function signup(email, password, confirmPassword){
    const e = normalizeEmail(email);
    const p = String(password || "");
    const c = String(confirmPassword || "");

    if(!e || !e.includes("@")){
        return { ok:false, message:"Enter a valid email address." };
    }
    if(p.length < 6){
        return { ok:false, message:"Password must be at least 6 characters." };
    }
    if(p !== c){
        return { ok:false, message:"Passwords do not match." };
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: e, password: p })
        });
        const data = await res.json();
        if (res.ok) {
            coreUserEmail = e;
            return { ok:true, message:"Account created." };
        } else {
            return { ok:false, message: data.error || "An error occurred." };
        }
    } catch (err) {
        return { ok:false, message: "Network error." };
    }
}

async function login(email, password){
    const e = normalizeEmail(email);
    const p = String(password || "");

    if(!e || !p){
        return { ok:false, message:"Enter email and password." };
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: e, password: p })
        });
        const data = await res.json();
        if (res.ok) {
            coreUserEmail = e;
            return { ok:true, message:"Logged in." };
        } else {
            return { ok:false, message: data.error || "Invalid credentials." };
        }
    } catch (err) {
        return { ok:false, message: "Network error." };
    }
}

async function logout(){
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        coreUserEmail = null;
    } catch (e) {}
}

async function requireAuth(){
    await checkAuthStatus();
    const file = (location.pathname || "").split("/").pop() || "";
    const publicPages = new Set(["login.html","signup.html"]);
    
    if(publicPages.has(file)) {
        if(isLoggedIn()){
            window.location.href = "index.html";
        }
        return;
    }

    if(!isLoggedIn()){
        localStorage.setItem("ft_redirectAfterLogin", location.href);
        location.href = "login.html";
    }
}

function updateAuthNav(){
    const loginLink = document.getElementById("navLogin");
    const signupLink = document.getElementById("navSignup");
    const logoutLink = document.getElementById("navLogout");
    const userChip = document.getElementById("navUserChip");

    const loggedIn = isLoggedIn();
    const email = getCurrentUserEmail();

    if(loginLink) loginLink.classList.toggle("hidden", loggedIn);
    if(signupLink) signupLink.classList.toggle("hidden", loggedIn);
    if(logoutLink) logoutLink.classList.toggle("hidden", !loggedIn);
    if(userChip){
        userChip.classList.toggle("hidden", !loggedIn);
        userChip.textContent = loggedIn ? email : "";
    }

    if(logoutLink){
        logoutLink.onclick = async function(e){
            e.preventDefault();
            await logout();
            updateAuthNav();
            location.href = "login.html";
        };
    }
}

window.addEventListener("load", async function(){
    await requireAuth();
    updateAuthNav();
});
