import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const API_KEY = "f0b56079261f79ffbc65b3e1";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  const fromAmount = amountInFromCurrency ? amount : amount / exchangeRate;
  const toAmount = amountInFromCurrency ? amount * exchangeRate : amount;

  useEffect(() => {
    fetch(`${BASE_URL}/USD`)
      .then((response) => response.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.conversion_rates)[0];
        setCurrencyOptions(Object.keys(data.conversion_rates));
        setFromCurrency(data.base_code);
        setToCurrency(firstCurrency);
        setExchangeRate(data.conversion_rates[firstCurrency]);
      })
      .catch((error) => console.error("Error fetching initial data:", error));
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${BASE_URL}/${fromCurrency}`)
        .then((response) => response.json())
        .then((data) => {
          setExchangeRate(data.conversion_rates[toCurrency]);
        })
        .catch((error) =>
          console.error("Error fetching exchange rate:", error)
        );
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  return (
    <div className="converter-container">
      <h1>Currency Converter</h1>
      <CurrencyRow
        options={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        options={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
}

export default App;
