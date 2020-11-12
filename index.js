const fs = require('fs');

//let readData = fs.readFileSync(process.stdin.fd, 'utf-8');
let readData = fs.readFileSync('pub01.in', 'utf-8');
let splitReadData = readData.split('\r\n');
let readDataArr = [];
let readDataObj = {};
// вх. обработка
splitReadData.forEach( (elem) => {
    if (/^\w=/.test(elem)) {
        // Это матрица
        let separatorIndex = elem.indexOf('=');
        let matrixName = elem.slice(0, separatorIndex);
        let matrixValue = elem.slice(separatorIndex + 2, elem.length - 1);
        let cols = matrixValue
            .slice(0, matrixValue.indexOf(';'))
            .replace(/[ -]/g, '')
            .length;
        let rows = matrixValue.split(';').length;
        matrixValue = matrixValue.replace(/;/g, '');
        matrixValue = matrixValue
            .split(' ')
            .map( elem => parseInt(elem));
        readDataArr = [...readDataArr, { matrixName, matrixValue, cols, rows } ];
    }
})
readDataObj.matrix = readDataArr.reduce( (acc, elem) => {
    const {cols, rows, matrixValue} = elem;
    return {...acc,
        [elem.matrixName]: {
            matrixValue,
            cols,
            rows,
        }
    }

}, {});
readDataObj.expression = splitReadData[splitReadData.length - 1];
readDataObj.expressionCount = readDataObj.expression.match(/[*+-]/g).length;


console.log(readDataObj);