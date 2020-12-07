
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function thicknessOptions() {
  document.getElementById("myThicknessDropdown").classList.toggle("show");
}

function unitOptions(){
    document.getElementById("myUnitDropdown").classList.toggle("show");
}


function selectThickness(selectedThickness)
{
    let thicknessString = selectedThickness.toString();
    let selectedThicknessAreaRef = document.getElementById("selectedThicknessId");
    selectedThicknessAreaRef.innerHTML = thicknessString + " g/sm";
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
}

function selectUnit(selectedUnit)
{
    if (selectedUnit == "feetAndInches")
    {
        selectedUnit = "Feet and Inches"
        getRef("unitInputArea").innerHTML =
            '<div style="font-size: 18px; text-align: center;">Width:</div>' +
            '<form action="#"><div id="widthArea" style="width: 100px; margin: auto;"' +
             'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
              'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="widthInput1"><label class="mdl-textfield__label"' +
              'for="widthInput1"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
              '<span id="unitDisplay1" style="font-size: 18px;"></span> <div id="widthArea" style="width: 100px; margin: auto;"' +
             'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
              'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="widthInput2"><label class="mdl-textfield__label"' +
              'for="widthInput2"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
              '<span id="unitDisplay2" style="font-size: 18px;"></span></form>' +
              '<div style="font-size: 18px;">Height:</div>' +
              '<form action="#"><div id="widthArea" style="width: 100px; margin: auto;"' +
               'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
                'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="heightInput1"><label class="mdl-textfield__label"' +
                'for="heightInput1"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
                '<span id="unitDisplay3" style="font-size: 18px;"></span> <div id="widthArea" style="width: 100px; margin: auto;"' +
               'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
                'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="heightInput2"><label class="mdl-textfield__label"' +
                'for="heightInput2"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
                '<span id="unitDisplay4" style="font-size: 18px;"></span></form>';
        getRef("unitDisplay1").innerHTML = "Feet";
        getRef("unitDisplay2").innerHTML = "Inches";
        getRef("unitDisplay3").innerHTML = "Feet";
        getRef("unitDisplay4").innerHTML = "Inches";
    }

    else
    {
        getRef("unitInputArea").innerHTML =
                    '<div style="font-size: 18px;">Width:</div>' +
                    '<form action="#"><div id="widthArea" style="width: 100px; margin: auto;"' +
                     'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
                      'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="widthInput"><label class="mdl-textfield__label"' +
                      'for="widthInput1"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
                      '<span id="unitDisplay1" style="font-size: 18px;"></span></form>' +

                       '<div style="font-size: 18px;">Height: :</div>' +
                      '<form><div id="heightArea" style="width: 100px; margin: auto;"' +
                     'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input"' +
                      'type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="heightInput"><label class="mdl-textfield__label"' +
                      'for="heightInput"></label><span class="mdl-textfield__error">Input is not a number!</span></div>' +
                      '<span id="unitDisplay2" style="font-size: 18px;"></span></form>';
        getRef("unitDisplay1").innerHTML = selectedUnit;
        getRef("unitDisplay2").innerHTML = selectedUnit;
    }

    getRef("selectedUnitId").innerHTML = selectedUnit;

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    componentHandler.upgradeDom();

}

function sendOrder(){
    let thickness = getRef("selectedThicknessId").innerHTML;
    let quan = source("quantity");
    let width, height;
    let units = getRef("selectedUnitId").innerHTML;
    if (units == "Feet and Inches")
    {
        width = source('widthInput1') +" feet " + source('widthInput2') + " inches";
        height = source('heightInput1') +" feet " + source('heightInput2') + " inches";
    }

    else
    {
        width = source('widthInput') + " " + units;
        height = source('heightInput') + " " + units;
    }

    addOrder(thickness, quan, width, height);
}

function addOrder(thicknessIn, quanIn, widthIn, heightIn)
{
    let myfileUpload = source("myfile");
    // Make a new user object
    let orderData = {
        thickness: thicknessIn,
        quantity: quanIn,
        width: widthIn,
        height: heightIn,
        file: myfileUpload
    };

    // Add it to the users branch in firebase
    addToBranch("orders", orderData)
}

// Close the dropdown menu if the user clicks outside of it
window.addEventListener("click", function(event) {
  if (!event.target.matches('.thicknessDropbtn') && !event.target.matches('.unitDropbtn') &&
   !event.target.matches('.thicknessDropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
});


