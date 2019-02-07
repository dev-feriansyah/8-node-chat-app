var searchParams = new URLSearchParams(window.location.search);
var obj = {};
for (var key of searchParams) {
  obj[key[0]] = key[1];
}
console.log(obj);
console.log(searchParams.toString());
console.log([...searchParams.keys()]);
// for (var key of searchParams.keys()) {
//   console.log(key);
// }