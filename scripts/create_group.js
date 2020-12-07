/**
 * Continuously called to perform input validation.
 * Replaces the alert errors.
 */
function inputCheck() {
    let name = sauce("name");

    let exists = false;
    let database = firebase.database();
    // See if the group name exists
    database.ref('groups').orderByChild('name')
        .equalTo(name).once('value', data => {
            data.forEach(() => {
                // If it does, output an error
                git("error").innerHTML = "<p>Group name exists.</p>";
                //disable the button
                git("submit").disabled = true;
                exists = true;
            });
        }).then(() => {
            if (!exists) {
                // If it doesn't, clear the error
                // and enable the 'Add Group' button
                git("error").innerHTML = "";
                git("submit").disabled = false;
            }
        });
}

/**
 * Adds a group to the database.
 */
function submit() {

    let database = firebase.database();

    if (sauce("name") === "" || sauce("unit") === "" || sauce("semester") === "") {
        git("error").innerHTML = "<br><p>Fields cannot be left empty </p>";
    } else {
        // Make a new group object
        let group = {
            name: sauce("name"),
            unit: sauce("unit"),
            semester: sauce("semester"),
            contributionNumber: 0
        };

        addToBranch("groups", group, group.name);

        // Send an alert an navigate back to the
        // lecturer's main page.
        alert("New group has been created \n\n " +
            "You will be redirected back to the main page shortly");

        //need to buy some time to allows successful
        setTimeout(function() {
            window.location = "lecmainpage.html";
        }, 1000);

    }
}