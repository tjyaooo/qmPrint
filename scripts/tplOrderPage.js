
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
    if (selectedUnit == "feetAndInches"){selectedUnit = "Feet and Inches"}
    getRef("unitDisplay1").innerHTML = selectedUnit;
    getRef("unitDisplay2").innerHTML = selectedUnit;
    let selectedUnitRef = getRef("selectedUnitId");
    selectedUnitRef.innerHTML = selectedUnit;
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

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