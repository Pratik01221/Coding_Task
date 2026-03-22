// // obj = {address: "123 Main St", name: "John Doe"}

// // obj.age = 30

// // console.log(obj)


// let car= {
//     type:"racing",
//     model:"500",
//     colour:"white"
// };

// console.log(car);

// const person ={
//     name:"pratik",
//     age:22,
//     college:"IMCC"
// }

// console.log(person);

// const student={}

// student.name="pratik";
// student.college="Imcc";
// student.add="pune";
// student.age=22;

// console.log(student);
// student.name=null;
// console.log(student);

// const s= new Object({
//   firstName: "John",
//   lastName: "Doe",
//   age: 50,
//   eyeColor: "blue"
// })

// // console.log(s);

// console.log(s.firstName);
// console.log(s["firstName"]);

// console.log(s.age);
// // console.log(s["age"]);

// const student={
//   firstName: "John",
//   lastName : "Doe",
//   age      : 50,
//   fullName: function(){
//     return this.firstName + " " + this.lastName
//   }
// };


// console.log(student.fullName());



// function Person( first, last, age ,color){
//     this.first=first;
//     this.last=last;
//     this.age=age;
//     this.color=color;
// }


// const Son = new Person("pratik","garad",22,"brownish");
// const father = new Person ("Narayan","garad",40,"Brownish");


// console.log(Son);
// console.log(father);

// Person.prototype.changeName=function(first){
//     this.first=first;
// }

// Son.changeName("rutik");
// console.log(Son);
// console.log(now);

// const cars = [];
// cars[0]= "Saab";
// cars[1]= "Volvo";
// cars[2]= "BMW";

// console.log(cars);

// const cars = new Array ("Saab", "Volvo", "BMW");

// console.log(cars);


// const person = new Array ("person1","person2","prson3");
// console.log(person[0]);
// console.log(person[1]);

// console.log(person.length);

// console.log(person[person.length-1]);


// const fruits = ["Banana", "Orange", "Apple", "Mango"];

// let text="";

// for(let i=0; i<fruits.length; i++){
//     text= text+fruits[i]+",";

// }

// console.log(text);

// const fruits = ["Banana", "Orange", "Apple", "Mango"];

// fruits.push("Guava")
// fruits.pop();
// fruits.shift();
// fruits.unshift("aangoor");
// console.log(fruits.sort());
// fruits[fruits.length]="grapes";

// fruits[8]="santri";

// console.log(fruits);

// let text="";
// fruits.forEach(function(element){
//     text= text+ element+",";
// })

// console.log(text);

// const fruits = ["Banana", "Orange", "Apple", "Mango"];

// console.log(typeof fruits);

// console.log(Array.isArray(fruits));

// arr.push(10)
// console.log(arr);
// arr.pop();
// arr.shift();
// console.log(arr);

// arr.forEach(num => console.log(num));

// let result = arr.map(num=> num*2);
// let even= arr.filter(num=> num%2===0);

// let sum = arr.reduce((acc,val)=> acc+val,0);


// const n= arr.find(num =>num >10);
// console.log(n);

// const I = arr.findIndex(num=>num >10);

// const I = arr.includes(15);
// console.log(I)
// console.log(arr.indexOf(5));
// console.log(arr.slice(0,5));
// let arr1=[10,20,30];
// console.log(arr.concat(arr1));
// console.log(arr.flat());
// console.log(arr.reverse());

// let r_arr=[]
// for (let i=arr.length-1; i>=0; i--){
//     r_arr.push(arr[i]);
// }

// console.log(r_arr);
// let arr = [1,2,3,4,5,6,7,8,15];

// let min=Math.min(...arr);
// let max=Math.max(...arr);

// console.log(min);
// console.log(max);


// console.log(arr)
// let unique = [...new Set(arr)];
// console.log(unique);

// let arr = [1,2,3,3,4,5,5,6,7,8,15];

// let sorted = [...new Set(arr)].sort((a,b)=>b-a);
// console.log(sorted);
