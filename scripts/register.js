/**
 * Grabs credentials from register.html
 * and attempts to create a new user.
 */
function register() {
    let companyName = source("companyNameId");
    let username = source("usernameId");
    let password = source("passwordId");
    let phoneNumber = source("phoneNumberId")

    let database = firebase.database();

    let exists = false;
    // See if the username exists
    database.ref('users').orderByChild('username')
        .equalTo(username).once('value', data => {
            data.forEach(() => {
                // If it does, output an error
                document.getElementById("error").innerHTML =
                    "<p>Username exists.";

                exists = true;
            });
        }).then(() => {
            if (!exists) {
                // If it doesn't, register the user.
                addUser(companyName, username, password, phoneNumber)
                console.log("New user created: " + username);
                alert("New user has been created.");
                window.location = "index.html";
            }
        });

}

/**
 * Adds a user to the database.
 */
function addUser(newCompanyName, newUsername, newPassword, newPhoneNumber) {
    // Make a new user object
    let userData = {
        company: newCompanyName,
        username: newUsername,
        password: newPassword,
        phoneNumber: newPhoneNumber,
        permission: "customer"
    };

    // Add it to the users branch in firebase
    addToBranch("users", userData)
}
