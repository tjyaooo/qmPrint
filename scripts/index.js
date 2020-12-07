/**
 * Grabs credentials from index.html
 * and attempts to login the user.
 */
function login() {
    // Using the error div as a status pane
    getRef("error").innerHTML = "<p>Logging in...</p>";

    let username = source("usernameId");
    let password = source("passwordId");
    let database = firebase.database();

    // True if the user has supplied valid
    // credentials.
    let passwordMatch = false;

    database.ref('users').orderByChild('username')
        .equalTo(username).once('value', data => {
            data.forEach(x => {
                // For each user that matches the username,
                // (should only be max 1 in theory)
                // try to match the password
                let user = x.val();
                localStorage.setItem(USER_KEY, JSON.stringify(user));

                if (user.password === password) {
                    passwordMatch = true;

                    let userType = user.permission;
                    switch (userType) {
                        case "customer":
                            window.location = "customerMainPage.html";
                            break;
                        case "lecturer":
                            break;
                    }
                }
            });

        }).then(() => {
            // If no user accounts match the credentials
            if (!passwordMatch) {
                // Display an error
                getRef("error").innerHTML =
                    "<p>Username/Password is incorrect.</p>";
            }
        });
}