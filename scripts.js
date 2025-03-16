const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.buttons');
const historyToggle = document.querySelector('.history-toggle');
const historyPanel = document.querySelector('.history-panel');
const historyList = document.querySelector('.history-list');
const extraFunctionsToggle = document.querySelector('.extra-functions-toggle');
const calculator = document.querySelector('.calculator');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.querySelector('body');
let currentInput = '';
let result = '';
let history = [];
let isHistoryOpen = false;
let isDarkMode = false;

// Ensure history panel is closed by default
historyPanel.classList.remove('active', 'opening-step1', 'closing-step1');

buttons[0].querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = button.textContent;

        if (value === 'C') {
            currentInput = '';
            result = '';
            display.value = '';
        } 
        else if (value === '=') {
            try {
                let expression = currentInput
                    .replace('×', '*')
                    .replace('÷', '/')
                    .replace(/√\(/g, 'Math.sqrt(')
                    .replace('sin', 'Math.sin')
                    .replace('cos', 'Math.cos')
                    .replace('tan', 'Math.tan')
                    .replace('asin', 'Math.asin')
                    .replace('acos', 'Math.acos')
                    .replace('atan', 'Math.atan')
                    .replace('log', 'Math.log10')
                    .replace('ln', 'Math.log')
                    .replace('π', 'Math.PI')
                    .replace('e', 'Math.E');
                
                const openParens = (expression.match(/\(/g) || []).length;
                const closeParens = (expression.match(/\)/g) || []).length;
                if (openParens > closeParens) {
                    expression += ')'.repeat(openParens - closeParens);
                }

                result = eval(expression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid calculation');
                }
                result = Math.round(result * 100000000) / 100000000;
                display.value = result;
                
                history.unshift(`${currentInput} = ${result}`);
                updateHistory();
                
                currentInput = result.toString();
            } catch (error) {
                display.value = 'Error';
                currentInput = '';
            }
        } 
        else if (value === 'H') {
            if (!isHistoryOpen) {
                // Open animation: Step 1 (slide down)
                historyPanel.classList.add('opening-step1');
                isHistoryOpen = true;
            } else {
                // Close animation: Step 1 (slide up)
                historyPanel.classList.remove('opening-step1');
                historyPanel.classList.add('closing-step1');
                setTimeout(() => {
                    historyPanel.classList.remove('closing-step1');
                }, 300);
                isHistoryOpen = false;
            }
        } 
        else if (value === '√' || ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln'].includes(value)) {
            currentInput += `${value}(`;
            display.value = currentInput;
        } 
        else if (value === 'π' || value === 'e') {
            currentInput += value;
            display.value = currentInput;
        } 
        else {
            currentInput += value;
            display.value = currentInput;
        }
    });
});

// Toggle extra functions panel
extraFunctionsToggle.addEventListener('click', () => {
    calculator.classList.toggle('active');
});

// Close history panel when clicking outside
document.addEventListener('click', (e) => {
    if (isHistoryOpen && !historyPanel.contains(e.target) && e.target !== historyToggle) {
        // Close animation: Step 1 (slide up)
        historyPanel.classList.remove('opening-step1');
        historyPanel.classList.add('closing-step1');
        setTimeout(() => {
            historyPanel.classList.remove('closing-step1');
        }, 300);
        isHistoryOpen = false;
    }
});

// Update history display
function updateHistory() {
    historyList.innerHTML = '';
    history.slice(0, 10).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

darkModeToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '🌙' : '☀️';
});

// Blur display when clicking outside calculator buttons
document.addEventListener('click', (event) => {
    if (!buttons[0].contains(event.target)) {
        display.blur();
    }
});