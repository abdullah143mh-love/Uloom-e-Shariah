// --- 1. CONFIGURATION & DATA ---
const getLoggedInUser = () => JSON.parse(localStorage.getItem('loggedInUser'));
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Global Mapping for Levels
const levelPages = {
    1: "index.html",
    2: "level2.html",
    3: "level3.html"
};

// --- 2. MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
    initTheme();
    
    const dashboardPages = ["index.html", "level2.html", "level3.html", "fiqh-books.html", ""];
    if (dashboardPages.includes(currentPage)) {
        setTimeout(() => {
            updateHomeProgress(); 
        }, 500);
    }
});

// --- 3. AUTH UI ---
function initAuthUI() {
    const user = getLoggedInUser();
    const guestLinks = document.querySelectorAll('.guest-only');
    const userLinks = document.querySelectorAll('.user-only');
    const navUsername = document.getElementById('navUsername');
    const navAvatar = document.getElementById('navAvatar');
    const welcomeText = document.getElementById('welcomeUser');
    const headerLevel = document.getElementById('headerLevel');

    if (user) {
        const nameToDisplay = user.name || user.displayName || user.email?.split('@')[0] || "User";
        if (navUsername) navUsername.textContent = nameToDisplay;
        if (navAvatar) navAvatar.textContent = nameToDisplay.charAt(0).toUpperCase();
        if (welcomeText) welcomeText.textContent = `Assalamualaikum, ${nameToDisplay}!`;
        if (headerLevel) headerLevel.textContent = user.level || "1";

        guestLinks.forEach(link => link.style.display = 'none');
        userLinks.forEach(link => link.style.display = 'flex');

        handleLevelRouting(user.level);
    } else {
        if (navUsername) navUsername.textContent = "Guest";
        if (navAvatar) navAvatar.textContent = "G";
        
        guestLinks.forEach(link => link.style.display = 'flex');
        userLinks.forEach(link => link.style.display = 'none');

        const publicPages = ["index.html", "login.html", "signup.html", ""];
        if (!publicPages.includes(currentPage)) {
            window.location.href = "login.html";
        }
    }
}

// --- 4. DYNAMIC PROGRESS & AUTO-UPGRADE ---
async function updateHomeProgress() {
    const pageSubjects = {
        "index.html": ["Taharah", "Tafseer", "Aqeedah", "Salaat", "Sirat"],
        "level2.html": ["Aqeedah-Tauheed", "Tafseer-Modouee", "Fiqh-Master", "Dawat"],
        "level3.html": ["L3-Ikhlaq", "L3-Shubuhaat", "L3-Hadith", "L3-UsoolTafseer", "L3-Nikah", "L3-Ilhad", "L3-UsoolFiqh", "L3-Buyoo"],
        "fiqh-books.html": ["Fiqh-Janaiz", "Fiqh-Zakaat", "Fiqh-Rozah", "Fiqh-Hajj", "Fiqh-Jihaad"]
    };

    const currentSubList = pageSubjects[currentPage] || pageSubjects["index.html"];
    
    // Mock Data
    const mockData = { 
        "Aqeedah-Tauheed": 40, "Tafseer-Modouee": 10, "Fiqh-Master": 25, "Dawat": 5,
        "Taharah": 60, "Salaat-Fiqh": 20 
    };
    
    let total = 0;
    let count = 0;

    currentSubList.forEach(id => {
        const percent = mockData[id] || 0;
        const bar = document.getElementById(`prog-${id}`);
        const text = document.getElementById(`text-${id}`);
        
        if (bar) {
            bar.style.width = percent + "%";
            if (text) text.innerText = percent + "%";
            total += percent;
            count++;
        }
    });

    const overall = count > 0 ? Math.round(total / count) : 0;
    const headerProgressBar = document.getElementById('headerProgressBar');
    const overallPercentText = document.getElementById('overallPercent');
    
    if (headerProgressBar) headerProgressBar.style.width = overall + "%";
    if (overallPercentText) overallPercentText.innerText = overall + "%";
    
    updateLearningButtons();

    // --- AUTO-UPGRADE LOGIC ---
    if (overall === 100) {
        const user = getLoggedInUser();
        if (user && user.level < 3 && (currentPage === levelPages[user.level] || (currentPage === "" && user.level === 1))) {
            user.level += 1;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert("Mubarak ho! Aapne ye level mukammal kar liya hai. Ab aap Level " + user.level + " par ja sakte hain.");
            window.location.href = levelPages[user.level];
        }
    }
}

// --- 5. ROUTING & ACCESS CONTROL ---
function handleLevelRouting(userLevel) {
    const correctPage = levelPages[userLevel] || "index.html";
    const allLevelPages = ["index.html", "level2.html", "level3.html"];
    
    // Strict Lock: Agar galat level page par ho toh wapas bhej do
    if (allLevelPages.includes(currentPage) && currentPage !== correctPage) {
        if(currentPage === "index.html" && userLevel == 1) return;
        
        alert(`Access Denied! Please complete your current Level first.`);
        window.location.href = correctPage;
    }
}

// --- 6. UI UTILITIES & THEME ---
window.toggleHamburger = function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
};

window.toggleDropdown = function(event, menuId) {
    event.stopPropagation();
    const targetMenu = document.getElementById(menuId);
    document.querySelectorAll('.dropdown-box').forEach(m => {
        if (m.id !== menuId) m.classList.remove('show');
    });
    if (targetMenu) targetMenu.classList.toggle('show');
};

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        // Dark mode ho toh Sun icon (light_mode), Light mode ho toh Moon icon (dark_mode)
        if (themeIcon) {
            themeIcon.innerText = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

function updateLearningButtons() {
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        const subId = card.getAttribute('data-sub-id');
        const bar = document.getElementById(`prog-${subId}`);
        const btn = document.getElementById(`btn-${subId}`);
        if (bar && btn) {
            btn.innerText = parseInt(bar.style.width) > 0 ? "Continue Learning" : "Start Learning";
        }
    });
}

// Global Click for Logout & Closing Menus
document.addEventListener('click', (e) => {
    if (!e.target.closest('.drop-down') && !e.target.closest('.profile-sec')) {
        document.querySelectorAll('.dropdown-box').forEach(m => m.classList.remove('show'));
    }
    if (e.target.closest('.logout-text')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = "index.html";
    }
});
