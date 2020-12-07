showLoggedInUser();
COLOURS =  [
    '#999966',
    '#669999',
    '#6600ff',
    '#66d9ff',
    '#ccffcc',
    '#ffffff',
    '#c299ff',
    '#40e0d0',
    '#ff66ff',
    '#1a1aff',
    '#000000',
    '#ffff66',
    '#008000',
    '#ff1a1a',
    '#ffa31a',
    '#00ff00',
    '#333333',
    '#994d00',
    '#ffd700',
    '#009999'
];
let studentColorMap;
cont1= {
    title : "Making Pie Chart",
    start : new Date(2020, 10, 21, 21, 0, 0, 0),
    end :  new Date(2020, 10, 23, 21, 0, 0, 0),
    snippet : "A WALL OF TEXT AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    comment : "",
    contributor: "j.washam"
}
cont2= {
    title : "Making Colored profiles",
    start : new Date(2020, 10, 20, 1, 9, 9, 0),
    end :  new Date(2020, 10, 20, 15, 9, 9, 0),
    snippet : "I LOVE BLUE COLORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    comment : "",
    contributor: "j.washam"
}
cont3= {
    title : "Nothing",
    start : new Date(2020, 9, 30, 6, 30, 19, 0),
    end :  new Date(2020, 9, 30, 16, 30, 19, 0),
    snippet : "LMAO I ACTUALLY DIDNT DO SHET",
    comment : "",
    contributor: "stu"
}
DUMMY_GROUP_OBJ= {
    contributions:
        [cont1,cont2,cont3],
    members:
    ["j.washam","p.papito","stu"],
    name: "Manga Semantics",
    semester: "2020-S2",
    unit: "ATS1337"
}
/**
 * On pageload, fetch the corresponding group data from local storage since user came from groupDetails
 *
 */
function fetchGroupObject(){
    //code to get group object from localstorage via unique identifier
    if (typeof(Storage) === "undefined") {
        git("result").innerHTML =
            "Sorry, your browser does not support Web Storage...";
    } else {
        //Variable to hold name from localStorage (current instance)
        let groupName = JSON.parse(localStorage.getItem(GROUP_KEY));
        //variable to hold the entire object cause local storage only holds name so we
        // need to refetch from DB
        let grpObj;
        //refetch
        database.ref(`groups/${groupName}`)
            .once('value', x => {
                let group = x.val();
                //console.log(group);
                grpObj = group; //save the entire group object
            });

        //for now we use the dummy as the grp obj
        grpObj = DUMMY_GROUP_OBJ;
        console.log(grpObj);

        //generating colormap
        studentColorMap = new Map()
        for(let i=0;i<grpObj.members.length;i++){
            studentColorMap.set(grpObj.members[i],COLOURS[i]);
        }
        console.log(studentColorMap)
        //once group is fetched, and color map generated
        //we can start generating student cards and the pie chart
        //generateStudentCards()
        generatePieChart(grpObj)
    }
}

/**
 * Generates piechart for the given group
 */
function generatePieChart(group){
    //initialise empty data set for piechart
    let dataPointsArray= Array(group.members.length).fill({y:0,indexLabel:"",color:""});
    console.log(dataPointsArray)
    console.log("^init")

    //generate chart Title
    let chartTitle = group.name + "'s total Contributions"

    //clone the contribution array for easy checks later
    let contributionArray = JSON.parse(JSON.stringify(group.contributions));
    //then generate for each student their own slice and add on to the piechart

    for (let j=0;j<group.members.length;j++){
        let dataIndex = dataPointsArray[j];
        console.log(j+ "before")
        console.log(dataPointsArray[j]);
        //What if the person doesnt do work? what if the ordering of contributions
        //are not in order of the students?
        //if student doesnt do work, he/she wont have labels
        //data.labels[j] = group.contributions[j].end - group.contributions[j].start;
        for(let k=0;k<contributionArray.length;k++){
            if(contributionArray[k].contributor == group.members[j]){
                dataIndex.y = group.contributions[j].end - group.contributions[j].start;
                dataIndex.indexLabel = group.members[j]
                dataIndex.color = studentColorMap.get(contributionArray[k].contributor)
                //remove current contribution
                contributionArray.splice(k, 1)
                break
                //match found no need to search anymore
            }
        }
        if(dataIndex.indexLabel== ""){
            dataIndex.y = 0;//search whole contriArray and no match found, didnt do work so 0
        }
        console.log("after")
        console.log(dataPointsArray[j]);
    }
    console.log("final")
    console.log(dataPointsArray)

    //write piechart onto CANVAS
    //initialise chart
    let chart = new CanvasJS.Chart("pieChartContainer",
        {
            animationEnabled: true, // change to false
            title:{
                text: chartTitle,
            },
            data: [
                {
                    type: "doughnut",
                    dataPoints: dataPointsArray

                }
            ]
        });
    chart.render();

}
function draw(dataIn) {


    console.log("REEEEEEEEEEE")
}

