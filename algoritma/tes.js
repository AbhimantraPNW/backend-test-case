// 1
function reverseStringExceptLastDigit(input) {
  let letters = input.slice(0, -1);
  let digit = input.slice(-1);

  let reversedLetters = letters.split("").reverse().join("");

  return reversedLetters + digit;
}

// Contoh penggunaan
let input = "NEGIE1";
let result = reverseStringExceptLastDigit(input);
console.log(result);

// 2
function longest(sentence) {
  const words = sentence.split(" ");

  let longestWord = "";
  let maxLength = 0;

  for (const word of words) {
    if (word.length > maxLength) {
      longestWord = word;
      maxLength = word.length;
    }
  }

  return `${longestWord}: ${maxLength} character${maxLength > 1 ? "" : ""}`;
}

const sentence = "Saya antusias untuk bergabung di PT. EIGEN TRI MATHEMA";
console.log(longest(sentence));


//   3
function countOccurrences(INPUT, QUERY) {
  const OUTPUT = [];

  for (const queryWord of QUERY) {
    const count = INPUT.filter((word) => word === queryWord).length;

    OUTPUT.push(count);
  }

  return OUTPUT;
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

const OUTPUT = countOccurrences(INPUT, QUERY);
console.log(OUTPUT);


// 4
function diagonalDifference(matrix) {
  let primaryDiagonalSum = 0;
  let secondaryDiagonalSum = 0;

  const size = matrix.length;

  for (let i = 0; i < size; i++) {
    primaryDiagonalSum += matrix[i][i];
    secondaryDiagonalSum += matrix[i][size - 1 - i];
  }

  return Math.abs(primaryDiagonalSum - secondaryDiagonalSum);
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

result = diagonalDifference(matrix);
console.log(result);
