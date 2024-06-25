export function createRandomNumber(digitos) {
    const min = Math.pow(10, digitos - 1);
    const max = Math.pow(10, digitos) - 1;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
}
