computeMemberColors();

let groupColors = {};

/**
 * generates the colors for every member in this group
 */
function computeMemberColors() {
    let group = JSON.parse(localStorage.getItem(GROUP_KEY));

    // Iterate over users to find user
    // Assign username: color pair

    let groupObject = {};
    database.ref(`groups/${group}/members`)

    // Get members of the team
    .once('value', x => groupObject = x.val())

    // Find their usernames
    .then(() => {
        database.ref('users')
            .orderByChild('permission')
            .equalTo("student")
            .once('value', data => {
                let selectedColour = null
                let usedColor = []
                let i = 0;
                data.forEach(y => {
                    // For each user

                    let user = y.val();
                    if (groupObject[user.name] !== undefined) {
                        // For anyone that's in the team, assign them with a color
                        selectedColour = getDistinctHSLColor(usedColor)
                        groupColors[user.username] = convertToColorHSL(selectedColour);
                        usedColor.push(selectedColour)
                        console.log(usedColor)
                        i++;
                    }
                });
            }).then(() => {
                console.log("then this gets run");
                populateContributions();
                console.log(groupColors);
                fetchGroupObject();
            });
    });
}

/**
 * calls the function to generate contribution cards for every contribution made
 */
function populateContributions() {
    group = JSON.parse(localStorage.getItem(GROUP_KEY));

    database.ref(`groups/${group}/contributions`)
        .once('value', x => {
            x.forEach(data => {
                let key = data.key;
                let contribution = data.val();

                git("contributions").innerHTML +=
                    getContributionItem(key, contribution);
            });
        });
}

/**
 * generates the html element "Contribution card"
 * @param key
 * @param contribution The contribution  object saved in database
 * @returns {string} The string to be appended to the HTML
 */
function getContributionItem(key, contribution) {
    return `<div class="child demo-card-square mdl-card mdl-shadow--2dp">
        <div style="background: ${groupColors[contribution.contributor]}" 
        class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">
                Author: ${contribution.contributor}
                <br>
                <br>
                Feature: ${contribution.feature}
                <br>
                <br>
                ${contribution.title}</h2>
        </div>

        <div class="mdl-card__supporting-text">
            Made on ${contribution.date}:
            ${contribution.start} - ${contribution.end}
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <a id="${key}"
               class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
               onclick="setContrubtion(this.id)">
                View Details
            </a>
        </div>
    </div>`
}

/**
 *
 * @param i
 * @returns {string}
 */
function getColor(i) {
    // Default Discord role colors
    const COLORS = ["rgb(26,188,156)",
        "rgb(233,30,99)",
        "rgb(52,152,219)",
        "rgb(46,204,113)",
        "rgb(155,89,182)",
        "rgb(241,196,15)",
        "rgb(17,128,106)",
        "rgb(173, 20, 87)",
        "rgb(32, 102, 148)",
        "rgb(31, 139, 76)",
        "rgb(113, 54, 138)",
        "rgb(194, 124, 14)"
    ]

    return COLORS[i % 12];
}

function setContrubtion(buttonID) {
    localStorage.setItem(CONTRIBUTION_KEY, JSON.stringify(buttonID));
    window.location.href = "viewContribution.html";
}


/**
 * fetch the corresponding group data from local storage since user came from groupDetails
 * Then generates piechart with the generate piechart function with the current group as argument
 */
function fetchGroupObject() {
    //code to get group object from localstorage via unique identifier
    if (typeof(Storage) === "undefined") {
        git("result").innerHTML =
            "Sorry, your browser does not support Web Storage...";
    } else {
        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));

        database.ref(`groups/${groupName}`)
            .once('value', x => {
                let group = x.val();
                console.log(group);
                // now we have a group object,
                generatePieChart(group);
            })


    }
}

/**
 * Generates piechart for the given group (argument)
 */
function generatePieChart(group) {
    console.log(groupColors)
        //generate chart Title
    let chartTitle = group.name + "'s total Contributions in hour(s)";

    if (group.contributionNumber == 0) {
        let errorMsg = group.name + " has not done anything yet";
        git("stats").innerHTML += `<h5 class="white-font">${errorMsg}</h5>`
        console.log("goodnight")
        return
    }

    //clone the contribution array for easy checks later
    let contriArray = JSON.parse(JSON.stringify(group.contributions));

    //generate map for total contribution time for easy indexing
    let contriMap = new Map(); //[key:username,value:total time]

    //break down the entries in contributions and add to map
    for (let item of Object.values(contriArray)) {
        console.log(item);
        let c = item

        //Breaking down date to generate new Date Obj for easy time calc
        let cDate = {
            year: parseInt(c.date.slice(0, 4)),
            month: parseInt(c.date.slice(5, 7)),
            day: parseInt(c.date.slice(8, 10))
        };
        let cStart = {
            hours: parseInt(c.start.slice(0, 2)),
            mins: parseInt(c.start.slice(3, 5))
        };
        let cEnd = {
            hours: parseInt(c.end.slice(0, 2)),
            mins: parseInt(c.end.slice(3, 5))
        };
        let endTime = new Date(cDate.year, cDate.month, cDate.day, cEnd.hours, cEnd.mins, 0, 0);
        let startTime = new Date(cDate.year, cDate.month, cDate.day, cStart.hours, cStart.mins, 0, 0);

        let time;
        //if end is earlier than time it must have meant the contributor started one day earlier so move date 1 day ahead
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
            time = ((endTime - startTime) / 3600000);
        } else {
            time = ((endTime - startTime) / 3600000);
        }

        //if key (username) doesnt exist add new key
        if (contriMap.get(c.contributor) === undefined) {
            contriMap.set(c.contributor, time)
        }
        //else add on to it
        else {
            let temp = contriMap.get(c.contributor) + time
            contriMap.set(c.contributor, temp)
        }
        //console.log(contriMap)
    }

    //then generate dataPointsArray for pie chart generation
    //let data = {y:0,indexLabel:"",color:""} <<datapointsarray is a collection of these
    let dataPointsArray = [] //Array(contriMap.size).fill({y:0,indexLabel:"",color:""});

    for (let [key, value] of contriMap) {
        console.log(key + ' = ' + value)
        console.log(groupColors)
        let c = groupColors[key]
        console.log(c)
        dataPointsArray.push({ y: value, indexLabel: key, color: c });
    }
    console.log(dataPointsArray)

    //updating the graph and display on HMTL
    let chart = new CanvasJS.Chart("stats", {
        animationEnabled: true, // change to false
        title: {
            text: chartTitle,
        },
        data: [{
            type: "doughnut",
            dataPoints: dataPointsArray

        }]
    });
    chart.render();

}