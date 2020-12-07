/**
 * Spike code
 *
 * There's only three methods here.
 * These are for directly modifying the database
 * without any input checks.
 *
 * Methods:
 * addUser(username, pasword, name, permission,
 * isAssigned)
 * Adds a user into the database.
 *
 * listUsers()
 * Lists all users.
 *
 * clearUsers()
 * Deletes all users.
 */

/**
 * Adds a user into the database
 */
function addUser(username, password, name, permission,
                 isAssgined) {
    console.log("Adding new user with these params:");
    console.log(`\tUsername: '${username}'`);
    console.log(`\tPassword: '${password}'`);
    console.log(`\tName: '${name}'`);
    console.log(`\tPermission: '${permission}'`);
    console.log(`\tisAssigned: '${isAssgined}'\n\n`);

    // Make a new user object
    let userData = {
        username: username,
        password: password,
        name: name,
        permission: permission,
        assigned: isAssgined
    };

    addToBranch("users", userData);

    console.log("Add successful!");
}

/**
 * Lists all users.
 */
function listUsers() {
    console.log("Listing all users...\n");

    let i = 0;
    firebase.database().ref('users').once('value', x => {
        x.forEach(y => {
            let user = y.val();

            i++;
            console.log(`User #${i}`);
            console.log(`\tName: ${user.name}`);
            console.log(`\tUsername: ${user.username}`);
            console.log(`\tPassword: ${user.password}`);
            console.log(`\tPermission level: ${user.permission}`);
            console.log(`\tAssigned?: ${user.assigned ? "True" : "False"}`);
        });
    }).then(() => {
        if (i === 0) {
            console.log("No users found.");
        }
    });
}

/**
 * Deletes all users.
 */
function clearUsers() {
    console.log("Clearing all users...\n\n");

    // Makes an empty user branch and
    // submits it to firebase.
    let entry = {};
    entry['/users/'] = {};
    let result = firebase.database().ref().update(entry);
    console.log("Cleared all users!");

}