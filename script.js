'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
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
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance-value');
const labelSumIn = document.querySelector('.summary-value-in');
const labelSumOut = document.querySelector('.summary-value-out');
const labelSumInterest = document.querySelector('.summary-value-interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.form-btn-transfer');
const btnLoan = document.querySelector('.form-btn-loan');
const btnClose = document.querySelector('.form-btn-close');
const btnSort = document.querySelector('.btn-sort');

const inputLoginUsername = document.querySelector('.login-input-user');
const inputLoginPin = document.querySelector('.login-input-pin');
const inputTransferTo = document.querySelector('.form-input-to');
const inputTransferAmount = document.querySelector('.form-input-amount');
const inputLoanAmount = document.querySelector('.form-input-loan-amount');
const inputCloseUsername = document.querySelector('.form-input-user');
const inputClosePin = document.querySelector('.form-input-pin');


// =======================================================================


const formatCurr = function(value, locale, currency){
   return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value); 
}


// =====================================================================

const formatMovementDate = function(date,locale){

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);
  console.log(dayPassed);

   if(dayPassed === 0) return 'Today'; 
   if(dayPassed === 1) return 'Yesterday';
   if(dayPassed <= 7) return `${dayPassed} days ago`;

  //   const day = `${date.getDate()}`.padStart(2,0);
  // const month = `${date.getMonth()}`.padStart(2,0);
  // const year = date.getFullYear();
 
 return new Intl.DateTimeFormat(locale).format(date)
}


// ====================================================================


const displayMovements = function(acc, sort = false){

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
   
    const displayDate = formatMovementDate(date,acc.locale);
    
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);
    

    const html = `
    <div class="movements-row">
     <div class="movements-type movements-type-${type}">${i + 1} ${type}</div>
     <div class="movements-date">${displayDate}</div>
     <div class="movements-value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

 });

};

// ===========================================================================


const CreateUserName = function(accs){

  accs.forEach(function(acc){

  acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0] ).join('') ; 

  })
}


CreateUserName(accounts);


// ===========================================================================

const withdrawals = account1.movements.filter(mov => {
  return mov < 0 ;
})



// ===========================================================================


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov , 0);

  labelBalance.textContent = formatCurr(acc.balance,acc.locale,acc.currency);
   
}

// ===========================================================================

const calcSummary = function(acc){
  
  const totalDepositsUSD = acc.movements
                           .filter(mov => mov > 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumIn.textContent =  formatCurr(totalDepositsUSD,acc.locale,acc.currency);

  const totalWithdrawUSD = acc.movements
                           .filter(mov => mov < 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumOut.textContent =  formatCurr(totalWithdrawUSD,acc.locale,acc.currency);

  const interestRate = acc.movements
                       .filter(mov => mov > 0)
                       .map(mov => mov * acc.interestRate/100)
                       .filter( (mov, i , arr) => {
                        return mov >= 1;
                       })
                       .reduce((acc,mov) => acc + mov , 0);
  labelSumInterest.textContent = formatCurr(interestRate,acc.locale,acc.currency);          
}

// ===========================================================================


let currentAccount; 




const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
const locale = navigator.language;
console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);






btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

   currentAccount =  accounts.find( acc => acc.username === inputLoginUsername.value);
   console.log(currentAccount);

  if(currentAccount && currentAccount.pin === Math.floor(inputLoginPin.value)){
   
   
    const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  
};
const locale = navigator.language;
console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // const day = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth() + 1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const min = `${now.getMinutes()}`.padStart(2,0);
    
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    
   
    // display ui and message

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // display movements
  updateUi(currentAccount);
  }

})


const updateUi = function(acc){
  displayMovements(acc);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcSummary(acc);
}

// =======================================================================

 btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username ===  inputTransferTo.value);

  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username){
 
//  ---------doing the transfer
  currentAccount.movements.push(-amount);
 receiverAcc.movements.push(amount);

// ---------add transder date

currentAccount.movementsDates.push(new Date().toISOString());
receiverAcc.movementsDates.push(new Date().toISOString()); 

//  -----update the ui

 updateUi(currentAccount);
}
 
 }) 


// =======================================================================

btnClose.addEventListener('click',()=>{
  e.preventDefault();
  
  if( inputCloseUsername.value === currentAccount.username && +(inputClosePin) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
   console.log(index);
  
   accounts.splice(index, 1);

   containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';  
})

// =======================================================

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if( amount > 0 && currentAccount.movements.some(mov => mov >= amount/10)){
    
    setTimeout(function(){    
      // --------loan transfer
      currentAccount.movements.push(amount);
      // --------------loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // -------------update ui
      updateUi(currentAccount)}, 2500);

  }
  inputLoanAmount.value = '';
})

// ========================================================

let sorted = false;
btnSort.addEventListener('click' , (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})


// ========================================================

labelBalance.addEventListener('click', () => {
  const movementsUi = Array.from(document.querySelectorAll('.movements-value'),
  el.textContent.replace('$', ''));
  console.log(movementsUi)

})

// ============================================================











