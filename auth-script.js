// Signup Form handle karna
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Page reload hone se rokna

        const name = this.querySelectorAll('input')[0].value;
        const email = this.querySelectorAll('input')[1].value;
        const password = this.querySelectorAll('input')[2].value;
        const confirmPassword = this.querySelectorAll('input')[3].value;

        // 1. Check Password Match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // 2. Pehle se save users ko nikalna (agar hain toh)
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // 3. Check if user already exists
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            alert("This email is already registered!");
            return;
        }

        // 4. Naya user save karna
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Account Created Successfully! Now you can Login.");
        window.location.href = "login.html"; 
        // Login page par bhejna
    }, 500);
}

//----------------------------------------------

// Login Form handle karna
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelectorAll('input')[0].value;
        const password = this.querySelectorAll('input')[1].value;

        // 1. Saved users ko nikalna
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. User dhundna aur password match karna
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // User mil gaya! Ab session save karna
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert("Welcome, " + user.name + "!");
            window.location.href = "index.html"; // Homepage par bhejna
        } else {
            alert("Invalid Email or Password!");
        }
    });
}
