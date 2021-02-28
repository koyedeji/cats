const params = {
  james: "name",
  chris: "abigail",
};

Object.keys(params).map((key) => {
  return `${key}=${params[key]}`;
});

console.log(params);
