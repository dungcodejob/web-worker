/// <reference lib="webworker" />

function isPrime(num: number): boolean {
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

addEventListener('message', ({ data }) => {
  const limit = data;
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }

  postMessage(primes);
});
