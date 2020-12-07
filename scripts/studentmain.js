showLoggedInUser();
populateGroups();

/**
 * Loads all enrolled groups of the student.
 */
function populateGroups() {
    let name = JSON.parse(localStorage.getItem(USER_KEY))
        .name;
    console.log(name);

    database.ref('groups')
        .once('value', x => {
            x.forEach(y => {
                y.forEach(data => {

                    if (data.hasChild(`/${name}`)) {
                        // If user is in this group,
                        // display it
                        git("units").innerHTML += formatGroupItem(y.val());
                    }
                })
            });
        }).then(() => {
            // After loading all groups, add a dummy group
            // for submitting enrollment requests.
            git("units").innerHTML += getEnrollGroupItem();
        });
}

/**
 * Given a group object, returns a group item to be
 * displayed on the page.
 */
function formatGroupItem(group) {
    return `<div class="child demo-card-wide mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">${group.name}</h2>
            </div>
            <div class="mdl-card__supporting-text">
                Unit: ${group.unit}
                <br>
                Semester: ${group.semester}
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a id="${group.name}" onclick="setGroup(this.id)" 
                class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                    View Details
                </a>
            </div>
        </div>`;
}

/**
 * Returns a dummy group item for submitting enrollment
 * requests.
 */
function getEnrollGroupItem() {
    return `<div class="child flex-container" id="taskbox">
            <!-- Square card to be generated if students not enrolled-->
            <div class="demo-card-square mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title mdl-card--expand">
                    <h2 class="mdl-card__title-text">Submit an enrollment request</h2>
                </div>
                <div class="mdl-card__supporting-text">
                    If you wish to join a new group, please click the button below
                     and submit an enrollment request to the group of your choice.
                </div>
                <div class="mdl-card__actions mdl-card--border">
                    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="showAssignDialog()">
                    Make Enrollment Request
                </a>
                </div>
            </div>
        </div>`;
}

/**
 * This function is used to make a request to enrol into a group by a student
 */
function groupEnroll() {
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    let groupName = document.getElementById("availableGroups").value;

    //Check if a group is selected
    if (groupName !== "") {
        console.log(groupName);
        // Make a new user object
        let notification = {
            name: user.name,
            group: groupName //only the group name -> can be used to search,
        };

        addToBranch("notify", notification, null,
            () => {
                hideAssignDialog();
                git("infoBox").innerHTML =
                    "<br>The request has been made, this box will disappear shortly";
            });

    } else {
        alert("Select A Group");
    }
}

/**
 * Displays the dialog for assigning groups to a student.
 *
 */
function showAssignDialog() {
    git("infoBox").innerHTML = "";
    git("modalBox").style.display = "block";

    // Get the student name from localstorage
    let studentName = JSON.parse(localStorage.getItem(USER_KEY)).name;

    // Populate the options menu with valid group choices
    database.ref('groups')
        .once('value', x => {
            x.forEach(data => {
                // For each group
                let group = data.val();
                console.log(group);

                // Check if student is not in the group
                database.ref(`groups/${group.name}/members/`)
                    .once('value', snapshot => {
                        if (!snapshot.hasChild(`/${studentName}`)) {
                            // If true, add group to options
                            // in dialog box
                            git("availableGroups").innerHTML +=
                                `<option value="${group.name}">${group.name}</option>`;
                        }
                    });
            });
        });


}

/**
 * Used for closing the assign group dialog.
 */
function hideAssignDialog() {

    //Clear group options
    git('availableGroups').innerHTML = "";

    let opt = document.createElement('option');
    git('availableGroups').appendChild(opt);

    //Disable modal box
    git("modalBox").style.display = "none";

    //Remove display
    git("infoBox").innerHTML = "";
}