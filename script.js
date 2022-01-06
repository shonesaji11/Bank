'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Walter White',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementDate: [],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jesse Pinkman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementDate: [],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Tuco Salamanca',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementDate: [],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Gustavo Fring',
  movements: [430, 1000, 700, 50, 90],
  movementDate: [],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentTime;
let logOutTime;
let validWindow;

const displayMovements = (movements) => {
  // reset any preset html 
  containerMovements.innerHTML = "";

  // add new html based on movement
  movements.forEach((currElem, index) => {
    let type = currElem > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1 } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${currElem}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  })
}

const createUsername = (accs)=>{
  accs.forEach((acc,i,arr) => {
    acc.userName = acc.owner.split(" ").map((name) => name[0].toLowerCase()).join("");
  })
}

const accBal = (userObj) => {
  let movements = userObj.movements;
  const interest =  movements.filter((currElem) => currElem > 0).map((currElem, index, arr) => currElem * userObj.interestRate/100).reduce((acc, intr) => acc + intr);
  return movements.reduce((accumulator,current) => accumulator + current, 0) + interest // 0 is initial value
}

const calcDisplayBal = (userObj) => {
  let movements = userObj.movements;
  const totalIn = movements.filter((currElem) => currElem > 0).reduce((acc, curr) => acc + curr);
  const totalOut = movements.filter((currElem) => currElem < 0).reduce((acc, curr) => acc + curr , 0) + 0;
  const interest =  movements.filter((currElem) => currElem > 0).map((currElem, index, arr) => currElem * userObj.interestRate/100).reduce((acc, intr) => acc + intr);
  labelBalance.textContent = (movements.reduce((accumulator,current) => accumulator + current, 0) + interest).toString() + "€"; // 0 is initial value
  labelSumIn.textContent = totalIn.toString() + "€";
  labelSumOut.textContent = totalOut.toString() + "€";
  labelSumInterest.textContent = interest.toString() + "€";
}

// Just to create username for each account - to illustrate usecase of forEach and map
createUsername(accounts);

const refreshUI = (user) => {
  labelWelcome.textContent = `Welcome back, ${user.owner}`;
  containerApp.style.opacity = 100;
  inputTransferAmount.value = inputTransferTo.value = "";
  displayMovements(user.movements);
  accBal(user);
  calcDisplayBal(user);
  getDate();
}

const refreshUIOnDelete = () => {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
}

function formatTime(value){
  let formattedVal;
  if(value < 0){
    value = 0;
  }
  if(Number(value) < 10){
    formattedVal = "0" + value;
  }else{
    formattedVal = value;
  }
  return formattedVal;
}

function getDate() {
  let x = new Date()
  let ampm = x.getHours( ) >= 12 ? ' PM' : ' AM';
  let hours = x.getHours( ) % 12;
  hours = hours ? hours : 12;
  let x1=x.getMonth() + 1+ "/" + x.getDate() + "/" + x.getFullYear(); 
  let seconds = formatTime(x.getSeconds());
  let minutes = formatTime(x.getMinutes());
  hours = formatTime(hours);
  x1 = x1 + " - " +  hours + ":" +  minutes + ":" + seconds + " " + ampm;
  labelDate.textContent = x1;
  setTimeout(getDate, 1000);
   }

function setValidWindow(){
  currentTime = new Date ();
  logOutTime = new Date ( currentTime );
  validWindow = 1;
  logOutTime.setMinutes ( currentTime.getMinutes() + validWindow );
  countDown();
}

function countDown() {
  var now = new Date().getTime();
  let distance = logOutTime - now;
  var minutes = formatTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  var seconds = formatTime(Math.floor((distance % (1000 * 60)) / 1000));
  labelTimer.textContent = `${minutes}:${seconds}`;
  currentAccount.timer = setTimeout(countDown,1000);
  if(distance < 1){
    clearTimeout(currentAccount.timer);
    alert("TIME UP");
    refreshUIOnDelete();
  }
}

// EVENT HANDLER
let currentAccount;
btnLogin.addEventListener('click', (event)=>{
  event.preventDefault() // prevent the form from from submitting (which causes page to refresh)
  let username = inputLoginUsername.value;
  let userpin = inputLoginPin.value;

  currentAccount = accounts.find((acc) => acc.userName === username);
  if(currentAccount?.pin === Number(userpin)){
    refreshUI(currentAccount);
    inputLoginPin.blur(); // to remove the cursor on the pin field after logging in
    setValidWindow();
  }else{
    alert("Invalid User name or password !!");
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
});

// Approve Loan only if there is a deposit that is greater than 10% of requested loan
btnLoan.addEventListener('click' , (event) => {
  event.preventDefault(); 
  const approveLoan = currentAccount.movements.some(tx => tx >= 0.1*inputLoanAmount.value);
  if(approveLoan && inputLoanAmount.value > 0){
    currentAccount.movements.push(Number(inputLoanAmount.value));
    refreshUI(currentAccount);
  }else{
    if(Number(inputLoanAmount.value) === 0){
      alert("Loan amount has to be greater than 0 !!")
    }else{
      alert(`Could not process loan for request amount !!`);
    }
  }
  inputLoanAmount.value = "";
})

btnTransfer.addEventListener('click' , (event)=>{
  event.preventDefault();
  const toAcc = accounts.find((acc) => acc.userName === inputTransferTo.value);
  const transferAmt = Number(inputTransferAmount.value);
  if(toAcc){
    if(transferAmt <= accBal(currentAccount)){
      const timeStamp = new Date();
      toAcc.movements.push(transferAmt);
      toAcc.movementDate.push(timeStamp);
      currentAccount.movements.push(-transferAmt);
      currentAccount.movementDate.push(timeStamp);
      alert(`Transferred ${transferAmt} to ${toAcc.owner.split(" ")[0]}`);
    }else{
      alert("Insufficient Amount !!");
    }
  }else{
    alert("Invalid Account !!");
  }
  refreshUI(currentAccount);
})

btnClose.addEventListener('click', (event) => {
  event.preventDefault();
  if(inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex((acc) => acc.userName = inputCloseUsername.value);
    accounts.splice(index, 1);
    refreshUIOnDelete();
  }else{
    alert("Incorrect Details");
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
})

let toggle = true;

btnSort.addEventListener('click' , (event) => {
  event.preventDefault();
  if(toggle){
    currentAccount.movements.sort((a , b) => a - b);
  }else{
    currentAccount.movements.sort((a , b) => b - a );
  }
  toggle = !toggle;
  displayMovements(currentAccount.movements);
})

