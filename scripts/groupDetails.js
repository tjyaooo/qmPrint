/**
 * Does a couple of things:
 * 1. Gets the chosen group and displays its info
 * 2. Hide certain HTML elements if the user is
 * a student.
 */



function initializeElements() {
    if (typeof(Storage) === "undefined") {
        git("result").innerHTML =
            "Sorry, your browser does not support Web Storage...";
    } else {
        //Variable to hold result from localStorage (current instance)
        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));

        database.ref(`groups/${groupName}`)
            .once('value', x => {
                let group = x.val();
                console.log(group);

                // Fetch group from firebase and update
                // the values of the HTML fields
                git("GroupID").innerHTML = group.unit;
                git("nameField").value = group.name;
                git("semField").value = group.semester;
            });


        //once group is fetched, we can load students and generate the chips (call function)
        contactChipGen(groupName);
        loadContributions();
    }

    if (getUser().permission === "student") {
        // Remove lecturer buttons
        git("addStudent").remove();
        git("button_deleteGroup").remove();

        // Should redirect back to student's page
        // instead of lecturer's
        git("anchor_return").href = "studentmain.html";
    }


}

/**
 * Checks if the a group has been selected
 * and if selected assigned the group to student
 */
function assignGroup() {
    //Get the student name and group name
    let studentName = sauce("students");
    let groupName = sauce("nameField");

    //Check if a group is selected
    if (studentName !== "") {
        assignStudent(studentName, groupName)
    } else {
        alert("Select A Student");
    }
}

/**
 * Used for closing the assign group dialog.
 */
function hideAssignDialog() {
    //Clear group options
    git('students').innerHTML = "";

    let opt = document.createElement('option');
    git('students').appendChild(opt);

    //Disable modal box
    git("studentModalBox").style.display = "none";
}

/**
 * Displays the dialog for assigning groups to a student.
 *
 */
function showAssignDialog() {
    git("studentModalBox").style.display = "block";

    // Populate the options menu for selecting groups
    studentDropbox();
}

/**
 * Adds group to the student and updates firebase accordingly
 */
function studentDropbox() {
    let database = firebase.database();

    database.ref('users')
        .orderByChild('permission')
        .equalTo('student')
        .once('value', x => {
            x.forEach(data => {
                // For each student
                let studentName = data.val().name;
                console.log(studentName);

                // Check if student is not in selected group
                let groupName = sauce("nameField");
                database.ref(`groups/${groupName}/members/`)
                    .once('value', snapshot => {
                        if (!snapshot.hasChild(`/${studentName}`)) {
                            // If true, add student to options
                            // in dialog box
                            git("students").innerHTML +=
                                `<option value="${studentName}">${studentName}</option>`;
                        }
                    });
            });
        });
}

/**
 * Auxiliary function used to generate the contact chips on page load.
 * @param groupName - The name of the group selected
 */
function contactChipGen(groupName) {
    git("contactBox").innerHTML += `<h4>Members</h4>`

    let database = firebase.database();
    database.ref(`groups/${groupName}/members`).once('value', x => {
        x.forEach(data => {
            let studentName = data.val();

            // For each member in groups, add a chip
            if (getUser().permission === "lecturer") {
                // If it's a lecturer, show a deletable chip
                git("contactBox").innerHTML += `<!-- Deletable Chip -->
                    <span class="mdl-chip mdl-chip--deletable">
                    <span class="mdl-chip__text">${data.val()}</span>
                    <button id="${groupName}\\${studentName}" 
                    type="button" class="mdl-chip__action"
                    onclick="unassignStudent(this.id)">
                    <i class="material-icons">cancel</i></button>
                    </span>`
            } else {
                // If it's a student, show a basic chip
                git("contactBox").innerHTML += `<!-- Basic Chip -->
                    <span class="mdl-chip">
                    <span class="mdl-chip__text">${data.val()}</span>
                    </span>`
            }
        });
    });
}

/**
 * A function that can be implemented if we were to add interactions to the contact chip
 * @param i The relative position of the studentChip the user has clicked on
 *
 */
//can be used later to view details of the student
function viewContactChip(i) {
    let student = groupName.members[i];
    console.log(student);
}

/**
 * Action handler for unassign button.
 * @param buttonID - The ID of the unassign button.
 */
function unassignStudent(buttonID) {
    if (confirm("Unassign this student?")) {
        let params = buttonID.split("\\");
        let groupName = params[0];
        let studentName = params[1];

        firebase.database()
            .ref(`groups/${groupName}/members/${studentName}`)
            .remove()
            .then(() => location.reload());
    }
}


function deleteGroup() {
    if (confirm("Delete this group?")) {
        let groupName = sauce("nameField");

        firebase.database().ref(`groups/${groupName}`).remove();
        window.location = "lecmainpage.html";
    }
}


function loadContributions() {
    let database = firebase.database();
    let number = 1;
    let totalTimeSpent = 0;
    let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
    // Loading the table of group contributions
    database.ref(`groups/${groupName}/contributions`)
        .once('value', x => {
            x.forEach(data => {
                let result = formatStudentContributions(number, data.val());
                git("tableBody1").innerHTML +=
                    result[0];
                number += 1;
                totalTimeSpent += Number(result[1]);

                git('totalTimeSpent').innerHTML = "Total Time Spent: " + parseFloat(totalTimeSpent).toFixed(2) +
                    " hours";

            });
        });

}

function formatStudentContributions(number, contributionData) {
    let timeSpent;
    var start = moment(contributionData.start, 'HH:mm');
    var end = moment(contributionData.end, 'HH:mm');
    //console.log(start);
    //commented out cause its a bit annoying sry
    if (end < start) {
        timeSpent = (24 - (start.diff(end, 'hours', true))).toFixed(2);
        console.log(timeSpent)

    } else {
        timeSpent = (end.diff(start, 'hours', true)).toFixed(2);
    }

    return [`<tr>` +
        `<td class=mdl-data-table__cell--non-numeric>` +
        number +
        `</td><td class=mdl-data-table__cell--non-numeric>` +
        contributionData.contributor +
        `</td><td class=mdl-data-table__cell--non-numeric>` +
        timeSpent + " hour(s)" +
        `</td>`, timeSpent
    ]

}

//! TASKS________________

function addTask() {
    if (sauce("taskToAdd") !== "") {
        let task = sauce("taskToAdd");
        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
        addToBranch(`groups/${groupName}/tasks`, task);
        alert("Task has been added. Reloading page.")
        location.reload();
    } else {
        alert("Task cannot be left empty.")
    }
}

function printTasks() {
    let table = git("taskBody");
    let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
    let i = 0;
    database.ref(`groups/${groupName}/tasks`)
        .once('value', x => {
            x.forEach(data => {
                table.innerHTML += `<tr>` +
                    `<td class=mdl-data-table__cell--non-numeric style='text-align:center;' id=task_${i}>` +
                    data.val() +
                    `</td>` +
                    `<td><span class="material-icons" style='float:right;' onclick='deleteTask(${i});'>delete</span></td></tr>`
                i++;
            });
        });
}

function deleteTask(id) {
    if (confirm("Delete this task?")) {
        let task = git(`task_${id}`).innerHTML;

        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
        firebase.database().ref(`groups/${groupName}/tasks`).once('value', snapshot => {
            snapshot.forEach(data => {
                var updates = {};
                if (data.val() == task) {
                    // var key = Object.keys(data.val())[0];
                    updates[data.key] = null;

                    firebase.database().ref(`groups/${groupName}/tasks`).update(updates);
                    alert("Task deleted. Reloading page.")
                    location.reload();
                }
            });
        });
    }

}