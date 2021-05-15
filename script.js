'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'John Doe',
  movements: [600, 250, -100, 3500, -855, -430, 70, 1350, 825, -320],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2019-12-23T07:42:02.383Z',
    '2020-02-28T09:15:04.904Z',
    '2020-03-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Orson Carte Pott',
  movements: [7000, 3400, -2450, -790, -3210, -1000, 8500, -30, 650, -2230],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-05-25T18:49:59.371Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2020-08-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Sarah Peace',
  movements: [430, 1000, 700, 50, 90, 1500],
  interestRate: 1.1,
  pin: 3333,
  movementsDates: [
    '2019-08-01T13:15:33.035Z',
    '2019-10-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-22T14:18:46.235Z',
    '2020-02-25T16:33:06.386Z',
    '2020-03-10T14:43:26.374Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

// Date Format
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice() && acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
      <div class="movements__date">${displayDate}</div>
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
  // Display Movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

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
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const min = `${now.getMinutes()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

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

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

// * Sort Movements
let sorted = false;

btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
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