let colorList = [];

function generateColor() {
    let colorHSL1 = Math.floor(Math.random() * 331);
    let colorHSL2 = 100
    let colorHSL3 = 50
    let option = Math.floor(Math.random() * 3);
    if (option == 0) {} else if (option == 1) {
        colorHSL2 = 100
        colorHSL3 = 60
    } else {
        colorHSL2 = 100
        colorHSL3 = 40
    }
    return [colorHSL1, colorHSL2, colorHSL3]
}

function getDistinctHSLColor(colorList) {
    let colorHSL = generateColor()

    let index = 0;
    while (index < colorList.length) {
        for (let i = 0; i < colorList.length; i++) {
            if (!checkDistinct(colorList[i], colorHSL)) {
                colorHSL = generateColor();
                index = 0
                break
            } else {
                index++;
            }
        }
    }
    return colorHSL
}

function checkDistinct(color1, color2) {
    if (Math.abs(color1[0] - color2[0]) > 40) {
        return true
    } else if (Math.abs(color1[2] - color2[2]) !== 0) {
        return true
    } else {
        return false
    }
}

function convertToColorHSL(colorHSL) {
    return `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2]}%)`;
}