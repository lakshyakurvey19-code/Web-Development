let units = 250;
let bill = 0;

if (units <= 100){
    bill = units * 2;
} 

else if(units <= 200){
    bill = (100 * 2) + (units - 100)*3;
} 

else{
    bill = (100 * 2) + (100 * 3) + (units - 200)*5;
}

console.log("Units Consumed:", units);
console.log("Electricity Bill: ₹" + bill);