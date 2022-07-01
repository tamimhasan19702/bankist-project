'use strict';

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  

  const accounts = [account1,account2,account3,account4];

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


const displayMovements = function(movements){
containerMovements.innerHTML = '';
 movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements-row">
     <div class="movements-type movements-type-${type}">${i + 1} ${type}</div>
     <div class="movements-value">${mov}$</div>
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
  
  labelBalance.textContent = `${acc.balance} EUR`;
  
}

// ===========================================================================

const calcSummary = function(acc){
  
  const totalDepositsUSD = acc.movements
                           .filter(mov => mov > 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumIn.textContent =  `${totalDepositsUSD} EUR`;

  const totalWithdrawUSD = acc.movements
                           .filter(mov => mov < 0)
                           .reduce((acc,mov) => acc + mov,0)
labelSumOut.textContent =  `${Math.abs(totalWithdrawUSD)} EUR`;

  const interestRate = acc.movements
                       .filter(mov => mov > 0)
                       .map(mov => mov * acc.interestRate/100)
                       .filter( (mov, i , arr) => {
                        return mov >= 1;
                       })
                       .reduce((acc,mov) => acc + mov , 0);
  labelSumInterest.textContent = `${interestRate} EUR`;          
}

// ===========================================================================


let currentAccount; 

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    


   currentAccount =  accounts.find( acc => acc.username === inputLoginUsername.value);
   console.log(currentAccount);

  if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)){
   
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
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcSummary(acc);
}

// =======================================================================

 btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username ===  inputTransferTo.value);

  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username){
 currentAccount.movements.push(-amount);
 receiverAcc.movements.push(amount)
 updateUi(currentAccount);
}
 
 }) 


// =======================================================================

btnClose.addEventListener('click',()=>{
  e.preventDefault();
  
  if( inputCloseUsername.value === currentAccount.username && Number(inputClosePin) === currentAccount.pin){
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

  const amount = Number(inputLoanAmount.value);

  if( amount > 0 && currentAccount.movements.some(mov => mov >= amount/10)){
    currentAccount.movements.push(amount);

    updateUi(currentAccount)
  }
  inputLoanAmount.value = '';
})







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



