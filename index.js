const fs = require('fs');

let readData = fs.readFileSync(process.stdin.fd, 'utf-8');
//let readData = fs.readFileSync('pub01.in', 'utf-8');
let input = processInput(readData);
let output = {...input}

let expression = output.expression;
try {
    for (let i = 0; i < output.expressionCount; i++) {
        if (/[*]/.test(expression)) {
            let operationIndex = expression.indexOf('*');

            let nameA = expression.slice(operationIndex - 1, operationIndex);
            let nameB = expression.slice(operationIndex + 1, operationIndex + 2);

            let result = multiplication(output.matrix[nameA], output.matrix[nameB]);
            expression = output.expression.replace(`${nameA}*${nameB}`, result.matrixName);
            output.matrix[result.matrixName] = result;
            delete output.matrix[nameB];
            continue;

        }
        if ( /[+]/.test(expression) ) {
            let operationIndex = expression.indexOf('+');

            let nameA = expression.slice(operationIndex - 1, operationIndex);
            let nameB = expression.slice(operationIndex + 1, operationIndex + 2);

            let result = addition(output.matrix[nameA], output.matrix[nameB]);
            expression = output.expression.replace(`${nameA}+${nameB}`, result.matrixName);
            output.matrix[result.matrixName] = result;
            delete output.matrix[nameB];
            continue;
        }
        if ( /[-]/.test(expression) ) {
            let operationIndex = expression.indexOf('-');

            let nameA = expression.slice(operationIndex - 1, operationIndex);
            let nameB = expression.slice(operationIndex + 1, operationIndex + 2);

            let result = subtraction(output.matrix[nameA], output.matrix[nameB]);
            expression = output.expression.replace(`${nameA}-${nameB}`, result.matrixName);
            output.matrix[result.matrixName] = result;
            delete output.matrix[nameB];
        }
    }
} catch (e) {
    console.log(e)
    throw new Error('Что-то пошло не так... Я не умею работать с разноразмерными матрицами')
}

fs.writeFileSync(process.stdout.fd,`\nРезультат вычисления: [${output.matrix[Object.keys(output.matrix)[0]].matrixValue}]`);

//

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
    let newRow = {
        nextIndex: 0, // default
        isNewRow: false,
    };
    let nextColIndex = 0; //default
    let nextRowIndex = 1;

    for (let i = 0; i < A.rows*A.cols; i++) {
        for (let j = 0; j < rowThreshold; j++) {
            if (newRow.isNewRow) {
                nextColIndex = 0;
                nextRowIndex = nextRowIndex + 1;
                stepA = newRow.nextIndex;
            } else {
                stepA = newRow.nextIndex + (rowThreshold - (rowThreshold - offset));
            }
            newRow.isNewRow = false;
            if (j === 0) {
                temp.push( A.matrixValue[stepA] * B.matrixValue[offset + nextColIndex] );
            } else {
                temp.push( A.matrixValue[stepA] * B.matrixValue[stepB + nextColIndex] );
                stepB += stepB;
            }
            offset++;
            if ( (i === rowThreshold * nextRowIndex - 1) && (j === rowThreshold - 1)) {
                newRow.nextIndex = newRow.nextIndex + rowThreshold;
                newRow.isNewRow = true;
            }
        }
        nextColIndex = nextColIndex + 1;
        // reset
        offset = 0;
        stepB = B.cols;
        sumTemp();
    }

    const C = {
        matrixValue: result,
        matrixName: A.matrixName,
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
        matrixName: A.matrixName,
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
        matrixName: A.matrixName,
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