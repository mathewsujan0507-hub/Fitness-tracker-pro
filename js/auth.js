const AUTH_KEYS = {
    users: "ft_users",
    currentUser: "ft_currentUser"
};

function normalizeEmail(email){
    return String(email || "").trim().toLowerCase();
}

function getUsers(){
    try{
        return JSON.parse(localStorage.getItem(AUTH_KEYS.users)) || [];
    }catch(_e){
        return [];
    }
}

function saveUsers(users){
    localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users || []));
}

function getCurrentUserEmail(){
    return normalizeEmail(localStorage.getItem(AUTH_KEYS.currentUser));
}

function isLoggedIn(){
    return Boolean(getCurrentUserEmail());
}

function signup(email, password, confirmPassword){
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

    const users = getUsers();
    if(users.some(u => normalizeEmail(u.email) === e)){
        return { ok:false, message:"An account with this email already exists." };
    }

    users.push({ email: e, password: p, createdAt: new Date().toISOString() });
    saveUsers(users);
    localStorage.setItem(AUTH_KEYS.currentUser, e);
    return { ok:true, message:"Account created." };
}

function login(email, password){
    const e = normalizeEmail(email);
    const p = String(password || "");

    if(!e || !p){
        return { ok:false, message:"Enter email and password." };
    }

    const users = getUsers();
    const user = users.find(u => normalizeEmail(u.email) === e);
    if(!user || String(user.password) !== p){
        return { ok:false, message:"Invalid email or password." };
    }

    localStorage.setItem(AUTH_KEYS.currentUser, e);
    return { ok:true, message:"Logged in." };
}

function logout(){
    localStorage.removeItem(AUTH_KEYS.currentUser);
}

function requireAuth(){
    const file = (location.pathname || "").split("/").pop() || "";
    const publicPages = new Set(["login.html","signup.html"]);
    if(publicPages.has(file)) return;

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
        logoutLink.onclick = function(e){
            e.preventDefault();
            logout();
            updateAuthNav();
            location.href = "login.html";
        };
    }
}

window.addEventListener("load", function(){
    requireAuth();
    updateAuthNav();
});

