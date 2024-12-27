let cnv = document.getElementById("cnv");
let ctx = cnv.getContext("2d");
window.onload = renderRules;


let start = "X";
let rules = {
    "X" : "XF[-X]F[+X]FX",
    "F" : [
        { rule: "X", probability: 0.1 },
        { rule: "FF", probability: 0.8 },
        { rule: "F", probability: 0.1 },
    ],
};
let position = {
    x : 250,
    y : 450
};
let angle = Math.PI/180*25;
let width = 1;
let length = 1;
let iterations = 5;


document.getElementById("start").value = start;
document.getElementById("angle").value = angle/Math.PI*180;
document.getElementById("width").value = width;
document.getElementById("length").value = length;
document.getElementById("iterations").value = iterations;
document.getElementById("positionx").value = position.x;
document.getElementById("positiony").value = position.y;

system = iteration(start, rules, iterations);
draw(ctx, system, position.x, position.y, angle, width, length);


function draw(ctx, system, x, y, angle, width = 1, length = 5, startAngle = Math.PI/2 ) {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,500,500);
    let stackOfStates = [];
    let stackOfPolygons = [];
    let currentPolygon = [];
    let clr = "#005522";// "rgb(255," + Math.floor(255*i/system.length) +",255)";
    for(let i = 0; i < system.length; i++) {
        if(system[i].codePointAt(0) >= 65 && system[i].codePointAt(0) <= 90 ){
            let temp = drawLine(ctx, x, y, length, startAngle, width, clr);//"#ffААff");
            x = temp[0];
            y = temp[1];

        } else if(system[i].codePointAt(0) >= 97 && system[i].codePointAt(0) <= 122 ){
            let temp = movePen(x, y, length, startAngle);
            x = temp[0];
            y = temp[1];

        } else if(system[i] == "+") {
            startAngle += -angle;
        } else if(system[i] == "-") {
            startAngle += angle;
        } else if(system[i] == "[") {
            stackOfStates.push(x);
            stackOfStates.push(y);
            stackOfStates.push(startAngle);
            stackOfStates.push(width);
        } else if(system[i] == "]") {
            width = stackOfStates.pop();
            startAngle = stackOfStates.pop();
            y = stackOfStates.pop();
            x = stackOfStates.pop();
        } else if(system[i] == ".") {
            currentPolygon.push([x,y]);
        } else if(system[i] == "{") {
            stackOfPolygons.push(currentPolygon);
            currentPolygon = [];
        } else if(system[i] == "}") {
            //draw polygon
            if (stackOfPolygons.length != 0) {
                ctx.beginPath();
                ctx.moveTo(currentPolygon[0][0], currentPolygon[0][1]);
                for (let i = 1; i < currentPolygon.length; i++) {
                    ctx.lineTo(currentPolygon[i][0], currentPolygon[i][1]);
                }
                ctx.closePath();
                ctx.strokeStyle = clr;
                ctx.fillStyle = "#2eaa86"; 
                ctx.fill();
                ctx.stroke();
                currentPolygon = stackOfPolygons.pop();
            } else {
                currentPolygon = [];
            }
        }
    }
}

function iteration(system, rules, iterations=1) {
    for(let e = 0; e < iterations; e++){
        let tempSystem = "";
        for(let i = 0; i < system.length; i++) {
            if(system[i] in rules){
                if (typeof rules[system[i]] === "string"){
                    tempSystem += rules[system[i]];
                } else if(Array.isArray(rules[system[i]])) {
                    let a = 0;
                    let temp = []
                    for (let j of rules[system[i]]){
                        a += j.probability;
                        temp.push(a);
                    }
                    let l = temp.findIndex(num => num > Math.random()*a)
                    tempSystem += rules[system[i]][l].rule;
                }
            } else {
                tempSystem += system[i];
            }
        }
        system = tempSystem;
    }
    return system;
}

function saveNewCharacteristics() {
    start = document.getElementById("start").value;
    angle = document.getElementById("angle").value/180*Math.PI;
    width = document.getElementById("width").value;
    length = document.getElementById("length").value;
    iterations = document.getElementById("iterations").value;
    position.x = Number(document.getElementById("positionx").value);
    position.y = Number(document.getElementById("positiony").value);
    
    system = iteration(start, rules, iterations);
    draw(ctx, system, position.x, position.y, angle, width, length);
}

function example() {
    const selectElement = document.getElementById("examples");
    const selectedValue = selectElement.value;
    update(examples[selectedValue]);
}

function update(example) {
    rules = example.rules;
    renderRules();
    document.getElementById("start").value = example.start;
    document.getElementById("angle").value = example.angle;///Math.PI*180;
    document.getElementById("width").value = example.width;
    document.getElementById("length").value = example.length;
    document.getElementById("iterations").value = example.iterations;
    document.getElementById("positionx").value = example.position.x;
    document.getElementById("positiony").value = example.position.y;
    saveNewCharacteristics();

}

function deleteRule(key, index) {
    if (rules[key].length > 1) {
        // Если для ключа несколько правил, удаляем по индексу
        rules[key].splice(index, 1);
    } else {
        // Если для ключа только одно правило, удаляем сам ключ
        delete rules[key];
    }
    renderRules(); // Перерисовываем таблицу
}

function saveNewRule() {
    const newKey = document.getElementById("newKey").value;
    const newValue = document.getElementById("newValue").value;
    const newProbability = parseFloat(document.getElementById("newProbability").value);

    if (newKey && newValue && !isNaN(newProbability)) {
        const newRuleObject = { rule: newValue, probability: newProbability };

        if (rules[newKey]) {
            rules[newKey].push(newRuleObject); // Добавляем новое правило в существующие
        } else {
            rules[newKey] = [newRuleObject]; // Если ключа нет, создаем новый массив правил
        }

        renderRules(); // Перерисовываем таблицу
    } else {
        alert("Please enter both key, value and probability.");
    }
}

function renderRules() {
    console.log(rules);
    system = iteration(start, rules, iterations);
    draw(ctx, system, position.x, position.y, angle, width, length);
    
    const rulesTable = document.getElementById("rulesTable");
    const body = rulesTable.querySelector("tbody");
    body.innerHTML = ''; // Очищаем тело таблицы перед рендером

    // Проходим по объекту правил и создаем строки таблицы
    for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
            const ruleData = rules[key]; // Получаем массив с правилами и вероятностями
            
            // Для каждого ключа выводим строку с первым правилом
            ruleData.forEach((rule, index) => {
                const row = document.createElement("tr");

                // Ячейка для ключа (вставляем только на первой строке для этого ключа)
                const keyCell = document.createElement("td");
                if (index === 0) {
                    keyCell.innerHTML = `<div class="table-text">${key}</div>`;
                } else {
                    keyCell.innerHTML = ''; // Оставляем пустое значение для последующих строк
                }
                row.appendChild(keyCell);

                // Ячейка для значения (правила)
                const valueCell = document.createElement("td");
                valueCell.innerHTML = `<div class="table-text">${rule.rule}</div>`;
                row.appendChild(valueCell);

                // Ячейка для вероятности
                const probabilityCell = document.createElement("td");
                probabilityCell.innerHTML = `<div class="table-text">${rule.probability}</div>`;
                row.appendChild(probabilityCell);

                // Ячейка для кнопки удаления
                const buttonCell = document.createElement("td");
                buttonCell.innerHTML = `<button class="table-button" onclick="deleteRule('${key}', ${index})">Удалить</button>`;
                row.appendChild(buttonCell);

                body.appendChild(row);
            });
        }
    }

    // Добавляем пустую строку для редактирования новых значений
    const editRow = document.createElement("tr");

    const newKeyCell = document.createElement("td");
    newKeyCell.innerHTML = `<input type="text" id="newKey">`;
    editRow.appendChild(newKeyCell);

    const newValueCell = document.createElement("td");
    newValueCell.innerHTML = `<input type="text" id="newValue">`;
    editRow.appendChild(newValueCell);

    const newProbabilityCell = document.createElement("td");
    newProbabilityCell.innerHTML = `<input type="number" id="newProbability">`;
    editRow.appendChild(newProbabilityCell);

    const saveButtonCell = document.createElement("td");
    saveButtonCell.innerHTML = `<button class="table-button" onclick="saveNewRule()">Сохранить</button>`;
    editRow.appendChild(saveButtonCell);

    body.appendChild(editRow);
}

let examples = {
    Plant1: {
        start: "X",
        rules: {
            "X": [{ rule: "F[-X][+X]FX", probability: 1 }],
            "F": [{ rule: "FF", probability: 1 }]
        },
        position: {
            x: 250,
            y: 450
        },
        angle: 45,
        width: 1,
        length: 1.5,
        iterations: 7
    },
    Plant2: {
        start: "X",
        rules: {
            "X": [{ rule: "F-[[X]+X]+F[+FX]-X", probability: 1 }],
            "F": [{ rule: "FF", probability: 1 }]
        },
        position: {
            x: 200,
            y: 450
        },
        angle: 25,
        width: 1,
        length: 4.5,
        iterations: 5
    },
    Plant3: {
        start: "X",
        rules: {
            "X": [{ rule: "XF[-X]F[+X]FX", probability: 1 }],
            "F": [
                { rule: "X", probability: 0.1 },
                { rule: "FF", probability: 0.8 },
                { rule: "F", probability: 0.1 },
            ],
        },
        position: {
            x: 250,
            y: 450
        },
        angle: 25, // угол в градусах
        width: 1,
        length: 1,
        iterations: 5
    },
    SierpinskiTriangleCurves: {
        start: "A",
        rules: {
            "A": [{ rule: "B-A-B", probability: 1 }],
            "B": [{ rule: "A+B+A", probability: 1 }]
        },
        position: {
            x: 50,
            y: 450
        },
        angle: 60,
        width: 1,
        length: 5,
        iterations: 6
    },
    SierpinskiTriangleTriangles: {
        start: "F-X-X",
        rules: {
            "F": [{ rule: "F-X+F+X-F", probability: 1 }],
            "X": [{ rule: "XX", probability: 1 }]
        },
        position: {
            x: 450,
            y: 450
        },
        angle: 120,
        width: 2,
        length: 6,
        iterations: 6
    },
    DragonCurve: {
        start: "FX",
        rules: {
            "X": [{ rule: "X+YF", probability: 1 }],
            "Y": [{ rule: "FX-Y", probability: 1 }]
        },
        position: {
            x: 250,
            y: 400
        },
        angle: 90,
        width: 1,
        length: 7,
        iterations: 8
    },
    KochSnowflake: {
        start: "F++F++F",
        rules: {
            "F": [{ rule: "F-F++F-F", probability: 1 }]
        },
        position: {
            x: 150,
            y: 400
        },
        angle: 60,
        width: 1,
        length: 1.5,
        iterations: 5
    },
    Leaf: {
        start: "S[x][y]",
        rules: {
            "x": [{ rule: "[++x{.].z.}", probability: 1 }],
            "y": [{ rule: "[--y{.].z.}", probability: 1 }],
            "z": [{ rule: "zF", probability: 1 }],
            "S": [{ rule: "SF", probability: 1 }]
        },
        position: {
            x: 250,
            y: 450
        },
        angle: 4,
        width: 1,
        length: 7,
        iterations: 19
    }
};

example();

document.querySelectorAll(".accordion-button").forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;

        // Если панель открыта, закрываем её
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            // Закрываем другие панели, если хотите только одну открытую
            document.querySelectorAll(".accordion-content").forEach(content => {
                content.style.maxHeight = null;
            });

            // Открываем текущую панель
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

saveButton.addEventListener('click', function() {
    // Получаем данные изображения в формате base64
    const dataURL = cnv.toDataURL('image/png');

    // Создаем элемент ссылки для скачивания
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.png'; // Имя файла

    // Симулируем клик по ссылке для начала скачивания
    link.click();
});
