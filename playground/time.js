const moment = require('moment');

const date = moment();
const dayAgo = new Date(2019, 1, 5, 1, 2);
console.log(dayAgo.getTime());

console.log(moment(dayAgo.getTime()).fromNow());
console.log(moment(dayAgo.getTime()).calendar());
console.log(date.format("h:mm a"));
console.log(moment(dayAgo.getTime()).format("h:mm a"));
console.log(date.calendar());