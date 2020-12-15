/**
 * This Javascript file is for defining functions
 * and constants that are commonly used throughout
 * different pages and should:
 *
 * 1. Be included in every HTML page and defined BEFORE
 * any script is called as a best practice.
 *
 * 2. Be independent and not interfere with any other
 * HTML/JS/CSS file.
 */

/* Use this to get the logged in user's user object
 from localstorage.
 */
const USER_KEY = "QM-user";


/* Use this to retrieve filenames of pages
 accessible by a certain usertype.
 */
const ACCESSIBLE_PAGES = {
    "customer": ["/customerMainPage.html", "/tplOrderPage.html"],
    "designer": ["/designerMainPage.html"]
}

/* Yep, no more declaring it on your own.
    We really should've done this from the start.
 */
let database = firebase.database();

/**
 * Self-explanatory function, cuz typing
 * document.getElementById was too long.
 *
 * Only for getting values. Not for setting values.
 */
function source(id) {
    return document.getElementById(id).value;
}

/**
 * For getting the element and not the value.
 */
function getRef(id) {
    return document.getElementById(id);
}

/**
 * For getting exactly what's inside the tag
 * (like other elements for example).
 *
 * Only for getting values. Not for setting values.
 */
function inner(id) {
    return document.getElementById(id).innerText;
}

/**
 * For logging out the current user.
 */
function logOut() {
    // Reset user details
    localStorage.setItem(USER_KEY, JSON.stringify(""));

    // Redirect user back to login page.
    window.location = "index.html";
}

/**
 *Gets the logged in username from the localStorage and displays it on a dedicated page div.
 */
function showLoggedInUser() {
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user != null) {
        getRef("userDisplay").innerHTML += user.username;
    }

    let database = firebase.database();
}

/**
 * Determines if the logged in user has permission
 * to view the current page.
 *
 * If the user does not have the right permissions,
 * the page is turned blank.
 */
function verifyPermission() {
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user == "")
    {
        // Should be denied access
        document.getElementsByTagName("body")[0].innerText = "Access Denied";
    }

    else
    {
        var url = window.location.pathname;
        var permissionsLst = ACCESSIBLE_PAGES[user.permission];
        if (!permissionsLst.includes(url)){
            // Should be denied access
            document
                .getElementsByTagName("body")[0]
                .innerText = "Access Denied";
        }
    }
}
/**
 * Appends a value to a branch in firebase.
 *
 * @param branch - The branch name
 * @param value - The value to be appended, can be
 * actual values, objects, arrays and pretty much
 * anything.
 * @param key - (Optional) Specify the key to be used.
 * @param thenCallback - (Optional) A function to be run
 * after the add process is completed.
 */
function addToBranch(branch, value, key = null, thenCallback = null) {
    let database = firebase.database();

    // Get a key for that object (for storing in
    // Firebase much like an ID I guess...?)
    if (key === null) {
        key = database.ref()
            .child(branch).push().key;
    }

    // Assign that object to a database entry thing
    let entry = {};
    entry[`/${branch}/` + key] = value;

    // And submit it to Firebase
    let result = database.ref().update(entry);
    console.log(`[INFO] Content added to '${branch}/${key}' branch: ${result}`);

    // If a then callback is specified, do it now
    result.then(thenCallback);
}

/**
 * Adds group to the student and updates firebase accordingly
 *
 * @param studentName - the name of the student that needs to be assigned
 * @param groupName - the group name that the student is assigned to
 */
function assignStudent(studentName, groupName) {
    addToBranch(`groups/${groupName}/members/`,
        studentName,
        studentName,
        // Reload
        () => {
            // Set the assigned attribute to true
            // if false
            database.ref('users')
                .orderByChild('name')
                .equalTo(studentName)
                .once('value', x => {
                    console.log("this is run!");
                    x.forEach(data => {
                        let student = data.val();
                        if (!student.assigned) {
                            let update = {};
                            update[`/users/${data.key}/assigned`] = true;
                            database.ref().update(update);
                        }
                    });
                }).then(() => location.reload());
        });
}



/**
 * Gets the user object of the currently
 * logges in user.
 */
function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}

/**
 * Get the duration in minutes between start time and end time
 * @param start - String in the format "01:22"
 * @param end - String in the format "01:22"
 * @returns integer value of the duration in minutes
 */
function timeSpentMinute(start,end){
    let startTime = parseInt(start.substr(0,2))*60 +
        parseInt(start.substr(3,5))

    let endTime = parseInt(end.substr(0,2))*60 +
        parseInt(end.substr(3,5))

    return endTime - startTime
}