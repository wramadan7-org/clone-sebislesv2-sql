/**
 * Balance calculation
 * @param {number} balance
 * @param {number} tax
 * @param {number} rate
 * @return {{taxBalance: number, rateBalance: number, resultBalance: number}}
 */
const calculateBalance = (balance, tax = 10, rate = 15) => {
  const taxBalance = Math.ceil(((100 / (100 + tax)) * balance) * (tax / 100));
  const rateBalance = Math.ceil((balance - taxBalance) * (rate / 100));
  const resultBalance = Math.ceil(balance - taxBalance - rateBalance);

  return {
    taxBalance,
    rateBalance,
    resultBalance,
  };
};

module.exports = {
  calculateBalance,
};
