// to do on load
let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
let group;
//get the group
database.ref(`groups/${groupName}`)
    .once('value', x => {
        group = x.val();
        console.log(group);
    });

let contributionId = JSON.parse(localStorage.getItem(CONTRIBUTION_KEY));
let user = JSON.parse(localStorage.getItem(USER_KEY));
let cont;

//check if its a viewing page for contributions
let view = true;

try {
    //add contribution doesnt have comments
    let comment = sauce("comment");
} catch (error) {
    //not a viewing page
    view = false;
}

//if view page load details
if (view) {
    //find contribution in the database and load its data
    database.ref(`groups/${groupName}/contributions/${contributionId}`)
        .once('value', x => {
            cont = x.val();

        }).then(() => {
            git("feature").innerHTML = cont.feature;
            git("title").innerHTML = cont.title;
            git("snippet").innerHTML = cont.snippet;
            git("startTime").innerHTML = cont.start;
            git("endTime").innerHTML = cont.end;
        });

    //load comments into table
    let comment;
    let i = 0;
    database.ref(`groups/${groupName}/contributions/${contributionId}/comments/`)
        .once('value', x => {
            x.forEach(data => {
                if (data.val() != undefined || data.val() != null) {
                    comment = data.val()

                    if (comment.commentor == user.username) {
                        git("commentsTable").innerHTML += `<tr>` +
                            `<td class=mdl-data-table__cell--non-numeric style = 'text-align: center;'>` +
                            comment.commentor +
                            `</td>` +
                            `<td class=mdl-data-table__cell--non-numeric style = 'text-align: center;' id='comment_${i}'>` +
                            comment.comment +
                            `</td>` +
                            `<td><span class="material-icons" style='float:right;' onclick = 'deleteComment(${i})'>delete</span></td>` +
                            `</td></tr>`
                        i++;
                    } else {
                        git("commentsTable").innerHTML += `<tr>` +
                            `<td class=mdl-data-table__cell--non-numeric style = 'text-align: center;'>` +
                            comment.commentor +
                            `</td>` +
                            `<td class=mdl-data-table__cell--non-numeric style = 'text-align: center;' id='comment_${i}'>` +
                            comment.comment +
                            `</td>` +
                            `<td></td>` +
                            `</td></tr>`
                        i++;

                    }
                }
            })
        })

} else {
    //load feature options
    database.ref(`groups/${groupName}/tasks`)
        .once('value', x => {
            x.forEach(data => {
                // For each student
                let task = data.val();

                git("feature").innerHTML +=
                    `<option value="${task}">${task}</option>`;

            });
        });
}


/**
 * Function used to save a contribution to the database
 */
function snippetSave() {
    let title = sauce("title");
    let startingTime = sauce("startTime");
    let endingTime = sauce("endTime");
    console.log(startingTime);
    console.log(endingTime);
    console.log(sauce('feature'));

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if ((title !== "") &&
        (sauce("snippet") !== "") &&
        (startingTime !== "") &&
        (endingTime !== "") &&
        (sauce('feature') !== "")
    ) {

        let contribution = {
            start: startingTime,
            end: endingTime,
            title: title,
            snippet: sauce("snippet"),
            feature: sauce("feature"),
            contributor: JSON.parse(localStorage.getItem(USER_KEY)).username,
            date: date
        }

        //get the number of contributions in the group
        let contributionNumber;

        database.ref(`groups/${groupName}/contributionNumber`)
            .once('value', x => {
                console.log(x.val())
                contributionNumber = x.val();
            }).then(() => {
                addToBranch(`groups/${groupName}/contributions`, contribution, `contribution_${contributionNumber}`)
                database.ref(`groups/${groupName}/contributionNumber`).set(contributionNumber + 1);
                window.location = "groupDetails.html";
            });

    } else {
        alert("Make sure to fill up the title, times, and contribution snippet")
    }
}




/**
 * function used to save comment to the database
 */
function commentSave() {
    if (sauce('comment') !== "") {
        let comment = {
            comment: sauce("comment"),
            commentor: JSON.parse(localStorage.getItem(USER_KEY)).username
        }
        addToBranch(`groups/${groupName}/contributions/${contributionId}/comments`, comment);
        alert("Comment has been added");
        location.reload();
    } else {
        alert("Comment cannot be left empty")
    }

}

/**
 * Function used to delete a certain comment
 * @param id. The number of the comment in the print order
 */
function deleteComment(id) {
    if (confirm('Delete this comment?')) {
        let comment = git(`comment_${id}`).innerHTML;
        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
        let contribution = JSON.parse(localStorage.getItem(CONTRIBUTION_KEY));

        firebase.database().ref(`groups/${groupName}/contributions/${contribution}/comments`).orderByChild('comment')
            .equalTo(`${comment}`).once('value', snapshot => {
                snapshot.forEach(data => {
                    console.log(data.key);

                    var updates = {};
                    if (data.val().comment == comment) {

                        updates[data.key] = null;

                        firebase.database().ref(`groups/${groupName}/contributions/${contribution}/comments`).update(updates);
                        alert("Comment deleted. Reloading page.")
                        location.reload();
                    }
                });

            });
    }

}