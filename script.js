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



// ====================================================================


const displayMovements = function(acc,sort = false){

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2,0);
    const month = `${date.getMonth()}`.padStart(2,0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements-row">
     <div class="movements-type movements-type-${type}">${i + 1} ${type}</div>
     <div class="movements-date">${displayDate}</div>
     <div class="movements-value">${mov.toFixed(2)}$</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html)

 });
} 

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
  
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
  
}

// ===========================================================================

const calcSummary = function(acc){
  
  const totalDepositsUSD = acc.movements
                           .filter(mov => mov > 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumIn.textContent =  `${totalDepositsUSD.toFixed(2)} EUR`;

  const totalWithdrawUSD = acc.movements
                           .filter(mov => mov < 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumOut.textContent =  `${Math.abs(totalWithdrawUSD.toFixed(2))} EUR`;

  const interestRate = acc.movements
                       .filter(mov => mov > 0)
                       .map(mov => mov * acc.interestRate/100)
                       .filter( (mov, i , arr) => {
                        return mov >= 1;
                       })
                       .reduce((acc,mov) => acc + mov , 0);
  labelSumInterest.textContent = `${interestRate.toFixed(2)} EUR`;          
}

// ===========================================================================


let currentAccount; 



btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    


   currentAccount =  accounts.find( acc => acc.username === inputLoginUsername.value);
   console.log(currentAccount);

  if(currentAccount && currentAccount.pin === Math.floor(inputLoginPin.value)){
   
   
    const now = new Date();

    const day = `${now.getDate()}`.padStart(2,0);
    const month = `${now.getMonth() + 1}`.padStart(2,0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2,0);
    const min = `${now.getMinutes()}`.padStart(2,0);
    
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    
   
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
    // --------loan transfer
    currentAccount.movements.push(amount);
    // --------------loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    // -------------update ui
    updateUi(currentAccount)
  }
  inputLoanAmount.value = '';
})

// ========================================================

let sorted = false;
btnSort.addEventListener('click' , (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


// ========================================================

labelBalance.addEventListener('click', () => {
  const movementsUi = Array.from(document.querySelectorAll('.movements-value'),
  el.textContent.replace('$', ''));
  console.log(movementsUi)

})

// ============================================================












// ============ side code =================================

//  const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//                          .filter(mov => mov > 0)
//                          .map(mov => mov * euroToUsd)
//                          .reduce((acc,mov) => acc + mov , 0);

// console.log(totalDepositsUSD);

// // const max = movements.reduce((acc,mov) => {
// //   if(acc > mov){
// //     return acc;
// //   }else{
// //     return mov;
// //   }
// // }, movements[0]);

// // console.log(max);

// // const calcAverageHumanAge = function(ages){
          
// //   const humanAge = ages.map( (age) => age <= 2 ? 2 * age : 16 + age * 4);


// //   const adults = humanAge.filter( age => age > 18);


// //   const average = adults.reduce((acc, age) => acc + age, 0)/adults.length;

// // }

// const calcAverageHumanAge = ages => ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//                                         .filter(age => age >= 18)
//                                         .reduce((acc,age,i,arr) => acc + age /arr.length,0) 

// calcAverageHumanAge([5,2,4,1,15,8,3]);

// 1

// const bankDepositSum = accounts
//                           .flatMap(acc => acc.movements)
//                           .filter(mov => mov > 0)
//                           .reduce((acc, mov) => acc + mov , 0 );

// console.log(bankDepositSum);


// // 2

// const numDeposits1000 = accounts
//                         .flatMap(acc => acc.movements)
//                         .reduce((count,curr) => (curr >= 1000 ? ++count : count), 0 );

//                         console.log(numDeposits1000);

// const numDeposits10002 = accounts
//                          .flatMap(acc => acc.movements)
//                          .filter( acc => acc >= 1000).length;

//                     console.log(numDeposits10002);

// // 3

const dogs = [
  {weight: 22, curfood: 250, owners: ['Alice', 'Bob']}, 
  {weight: 8, curfood: 200, owners: ['Matilda']}, 
  {weight: 13, curfood: 275, owners: ['Sarah', 'John']}, 
  {weight: 32, curfood: 340, owners: ['Michel']}, 
];

// 1

dogs.forEach((dog) =>{
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  console.log(dog);
})

// 2

dogs.forEach(dog => {
  if(dog.owners.includes('Sarah')){
   if(dog.curfood > dog.recommendedFood){
    console.log('yeah her dog eating too much');
   }else{
    console.log('its eating okey')
   }
  }
})

// 3

const ownerEatToomuch = dogs.filter( dog => dog.curfood > dog.recommendedFood).flatMap( dog => dog.owners);
console.log(ownerEatToomuch);
const ownerEatToolittle = dogs.filter( dog => dog.curfood < dog.recommendedFood).flatMap( dog => dog.owners);
console.log(ownerEatToolittle);

// 4

console.log(`${ownerEatToomuch.join(' and ')} dogs eat too much, ${ownerEatToolittle.join(' and ')} dogs eat too little!`);


// 5

console.log(dogs.some(dog => dog.curfood === dog.recommendedFood));

// 6

console.log(dogs.some(dog => dog.curfood > (dog.recommendedFood * 0.90) && dog.curfood < (dog.recommendedFood * 1.10))) 

// 7

const checkEat = dog => dog.curfood > (dog.recommendedFood * 0.90) && dog.curfood < (dog.recommendedFood * 1.10);


console.log(dogs.some(checkEat));

console.log(dogs.filter(checkEat));

const dogsCopy = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood)
