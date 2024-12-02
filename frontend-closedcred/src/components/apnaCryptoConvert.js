import CryptoConvert from "crypto-convert";

const convert = new CryptoConvert({
    calculateAverage: true, //Calculate the average crypto price from exchanges
    binance: true, //Use binance rates
    coinbase: true, //Use coinbase rates
});

await convert.ready();

export default convert;