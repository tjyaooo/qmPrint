//Log out the currently logged in account
// and go back to log in screen
showLoggedInUser();

/**
 * Creates a lecturer object and writes it to
 * the database upon clicking the create lecturer account
 */
function createLecturer() {
    // Get values from the input
    let username = sauce("username");
    let name = sauce("name");
    let password = sauce("password");
    let confirmPassword = sauce("confirmPassword");

    if (username === "" || name === "" ||
        password === "" || confirmPassword === "") {

        alert("Fields cannot be left blank.");
    } else {
        if (confirmPassword === password) { // Can't leave fields empty and passwords must match

            // Make a new user (lecturer) object
            let userData = {
                username: username,
                password: password,
                name: name,
                permission: "lecturer"
            };

            addToBranch("users", userData)

            alert("New lecturer account has been created. \n\n The page will reload shortly");

            // Need to buy some time to allows successful
            setTimeout(function() {
                location.reload();
            }, 1000);

        } else {
            alert("Passwords do not match.")
        }
    }
}


function populateTable() {
    //Print all the users in a table ON LOAD
    let printedUsers = [];
    let database = firebase.database();
    let tableBody = git("tableBody");
    let i = 0;
    database.ref('users').once('value', function(data) {
        data.forEach(x => {
            //printedUsers = x.val(); //can get all the printed users

            // For each user entry on users, add them to the table
            if (x.val().permission === "lecturer") {
                tableBody.innerHTML +=
                    "<tr><td class=mdl-data-table__cell--non-numeric>" +
                    x.val().name +
                    `</td><td id="username_${i}">` +
                    x.val().username +
                    `</td><td><button id=delete_${i} class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab'` +
                    "onclick=deleteLecturer(this.id)>" +
                    "<i class=material-icons>delete</i></button></td></tr>";
            }

            i++;

        });
    });
}

function deleteLecturer(id) {
    console.log(id);
    let elementId = id.replace("delete", "username");
    console.log(elementId);
    let username = inner(elementId);

    firebase.database().ref('users').orderByChild('username').equalTo(username).once('value', snapshot => {
        var updates = {};
        snapshot.forEach(child => updates[child.key] = null);
        firebase.database().ref('users').update(updates);
        location.reload();
    });

}