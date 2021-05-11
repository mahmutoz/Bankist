'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'John Doe',
  movements: [600, 250, -100, 3500, -855, -430, 70, 1350, 825, -320],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Orson Carte Pott',
  movements: [7000, 3400, -2450, -790, -3210, -1000, 8500, -30, 650, -2230],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Sarah Peace',
  movements: [430, 1000, 700, 50, 90, 1500],
  interestRate: 1.1,
  pin: 3333,
};

const accounts = [account1, account2, account3];

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

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

const displayMovements = function (mov, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? mov.slice() && mov.slice().sort((a, b) => a - b) : mov;

  movs.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${move}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calcDispalySummary = function (acc) {

  const outComes = acc.movements.filter(move => move < 0).reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs((outComes).toFixed(2))}€`;

  const inComes = acc.movements.filter(move => move > 0).reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${(inComes.toFixed(2))}€`;

  const interest = acc.movements.filter(move => move > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => int >= 1).reduce((acc, move) => acc + move, 0);
  labelSumInterest.textContent = `${(interest).toFixed(2)}€`;
}

const creatUserNames = function (accs) {
  accs.forEach(acc =>
    acc.userName = acc.owner.toLowerCase().split(' ').map(n => n[0]).join('')
  )
}
creatUserNames(accounts);

const updateUI = ((acc) => {
  // Display balance
  calcDisplayBalance(acc);

  // Display Movements
  displayMovements(acc.movements);

  // Display Summary
  calcDispalySummary(acc);
});

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(user => user.userName === inputLoginUsername.value);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);

  } else {
    alert('Wrong username or password!');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  console.log(amount, receiverAcc);

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// Request Loan

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(move => move >= amount * 0.1)) {
    // Add amount
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

// * Sort Movements
let sorted = false;

btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

    // delete account
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});