// let arr = [];

// arr.__proto__;

// // console.log(arr.__proto__);
// console.log(arr.__proto__.__proto__);

let objet1 = {
  name: "kiran",
  city: "khatima",
  show: function () {
    console.log(this.name + "  " + this.city);
  },
};

// console.log(objet1);
// console.log(objet1.__proto__);

let objet2 = {
  name: "Krishna",
};

objet2.__proto__ = objet1;

console.log(objet2);
console.log(objet2.__proto__);

objet2.show();

//  only functions have prototype property
// console.log(objet2.prototype);  // error

function A() {
  this.name = "Kiran";
}

A.prototype.city = "Khatima";

let a = new A();
console.log(a);
console.log(a.city);
