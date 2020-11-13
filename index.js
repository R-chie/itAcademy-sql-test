const fs = require('fs');

//let readData = fs.readFileSync(process.stdin.fd, 'utf-8');
let readData = fs.readFileSync('pub01.in', 'utf-8');
let input = processInput(readData);

addition(input.matrix.B, input.matrix.E);
subtraction(input.matrix.B, input.matrix.E);
multiplication(input.matrix.B, input.matrix.E);

function multiplication(A, B) {
    let result = [];
    let temp = [];
    let sumTemp = () => {
        result = [...result, temp.reduce( (a, i) => a + i, 0)]
        temp = [];
    };
    let rowThreshold = A.cols;
    let stepA;
    let offset = 0;
    let stepB = B.cols;

    for (let i = 0; i < A.rows*A.cols; i++) {
        for (let j = 0; j < rowThreshold; j++) {
            stepA = rowThreshold - (rowThreshold - offset);
            if (j === 0) {
                temp.push( A.matrixValue[stepA] * B.matrixValue[offset + i] )
            } else {
                temp.push( A.matrixValue[stepA] * B.matrixValue[stepB + i] )
                stepB +=stepB;
            }
            offset++;
        }
        // reset
        offset = 0;
        stepB = B.cols;
        sumTemp();
    }

    const C = {
        matrixValue: result,
        matrixName: A.matrixName + B.matrixName,
        // тут еще посмореть как определить количество строк и столбцов
        cols: A.cols,
        rows: A.rows,
    };
    console.log(`${A.matrixValue} \n*\n ${B.matrixValue} \n=\n ${result}`);
    console.log('multiplication result:', C)
    return C;
}

function subtraction(A, B) {
    let result = [];
    for (let i = 0; i < A.matrixValue.length; i++) {
        result[i] = A.matrixValue[i] - B.matrixValue[i];
    }
    const C = {
        matrixValue: result,
        matrixName: A.matrixName + B.matrixName,
        // тут еще посмореть как определить количество строк и столбцов
        cols: A.cols,
        rows: A.rows,
    };
    console.log(`${A.matrixValue} \n-\n ${B.matrixValue} \n=\n ${result}`);
    console.log('subtraction result:', C)
    return C;
}

function addition(A, B) {
    let result = [];
    for (let i = 0; i < A.matrixValue.length; i++) {
        result[i] = A.matrixValue[i] + B.matrixValue[i];
    }
    const C = {
        matrixValue: result,
        matrixName: A.matrixName + B.matrixName,
        // тут еще посмореть как определить количество строк и столбцов
        cols: A.cols,
        rows: A.rows,
    };
    console.log(`${A.matrixValue} \n+\n ${B.matrixValue} \n=\n ${result}`);
    console.log('addition result:', C)
    return C;
}

function processInput(readData) {
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
        const {cols, rows, matrixValue, matrixName} = elem;
        return {...acc,
            [matrixName]: {
                matrixName,
                matrixValue,
                cols,
                rows,
            }
        }

    }, {});
    readDataObj.expression = splitReadData[splitReadData.length - 1];
    readDataObj.expressionCount = readDataObj.expression.match(/[*+-]/g).length;
    console.log(readDataObj);
    return readDataObj;
}