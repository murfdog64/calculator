var screen = document.getElementById('screen');
var calculator = document.getElementById('calculator');
var decimal = document.getElementById('decimal');
var equals = document.getElementById('equals');
var clear = document.getElementById('clear');
var posNeg = document.getElementById('posneg');
var solar = document.getElementById('solar');

var lastIsOp = false;
var canDec = true;
var evaluated = false;

var currNum = '0';
var currOp = '';
var segments = [];

calculator.addEventListener('click', function(event){
  var target = event.target;
  var buttonType = target.innerText;
  if(target.matches('.number')) {
    handleNumber(buttonType);
  } else if (target.matches('#decimal')) {
    handleDecimal();
  } else if (target.matches('.op')) {
    handleOperator(buttonType);
  } else if (target.matches('#equals')) {
    handleEquals();
  } else if (target.matches('#clear')) {
    handleClear();
  } else if (target.matches('#posneg')) {
    handlePosNeg();
  }
});

function handleNumber(number) {
  // if(currNum) {
  //   addToScreen(number);
  //   currNum += number;
  // } else if (currOp) {
  //   segments.push(currOp);
  //   currOp = '';
  // }
  if (currNum.includes('.')) {
    addToScreen(number);
    currNum += number;
  } else if (screen.innerText === '0' || evaluated === true) {
    segments = [];
    setScreen(number);
    currNum = number;
  } else {
    addToScreen(number);
    currNum += number;
  } 
  lastIsOp = false;
  evaluated = false;
}

function handleOperator(op) {
  if (lastIsOp) {
    var newScreenTxt = screen.innerText.slice(0,-1) + op;
    setScreen(newScreenTxt);
    segments.pop();
    segments.push(op); 
  } else {
    segments.push(currNum);
    addToScreen(op);
    segments.push(op);
  }
  currOp = op;
  lastIsOp = true;
  canDec = true;
  evaluated = false;
  currNum = '';
}

function handleDecimal() {
  if (lastIsOp) {
    currNum += '0.';
    addToScreen('0.');
  }
  else if(canDec) {
    currNum += '.';
    addToScreen('.');
    console.log(currNum);
  }
  canDec = false;
}

function handleClear() {
  setScreen('0');
  currNum = '';
  segments = [];
  lastIsOp = false;
  canDec = true;
  evaluated = false;
}

function handleEquals() {
  if (currNum === '-') {
    segments.push('0');
  } else if (currNum) {
    segments.push(currNum);
    currNum = '';
  } else {
    currOp = '';
  }
  for ( var i = 0; i < segments.length; i+=2) {
    if (segments[i].startsWith('-')) {
      segments[i] = '(' + segments[i] + ')';
    }
  }
  var newEval = eval(segments.join(''));
  setScreen(newEval);
  lastIsOp = false;
  evaluated = true;
  segments = [];
  currNum = newEval.toString();
  if (newEval % 1) {
    canDec = false;
  } else {
    canDec = true;
  }
}

function setScreen(val) {
  screen.innerText = val;
}

function addToScreen(val) {
  if (screen.innerText.length > 10) {
    return;
  } else {
    screen.innerText += val;
  }
}

function handlePosNeg() {
  if (currNum && currNum.startsWith('-')) {
    currNum = currNum.slice(1);
  }
  else if (currNum) {
    currNum = '-' + currNum;
  }
  else if (lastIsOp) {
    segments.pop(currOp);
    currOp = null;
    setScreen(screen.innerText.slice(0,-1));
    addToScreen('-0');
    currNum = '-0'
  }
  else if (currNum.length === 2 && Math.abs(+currNum) === 0) {
    currNum = '0';
    var newScreenTxt = screen.innerText.slice(0,-2) + '0';
    setScreen(newScreenTxt);
  } 
  else {
    currNum = '-';
    segments.push(currOp);
    currOp = '';
  }
  var newScreenText = segments.join('') + currNum;
  setScreen(newScreenText);
}

document.addEventListener('keyup', function(event){
  console.log("KEYS!", event);
  var keyStroke = event.keyCode;
  if (keyStroke >= 48 && keyStroke <= 57) {
    handleNumber(event.key);
  } else if (keyStroke === 187 || keyStroke === 189 || keyStroke === 191) {
    handleOperator(event.key)
  } else if (keyStroke === 13) {
    handleEquals();
  }
});

// solar.onmouseover = solar.onmouseout = solarHandler;

// function solarHandler(event) {
//   if (event.type === 'mouseover') {
//     screen.innerText.style.opacity = '0';
//   }
//   if (event.type === 'mouseout') {
//     screen.innerText.style.opacity = '100';
//   }
// }