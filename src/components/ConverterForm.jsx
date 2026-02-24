
import { useState, useEffect } from "react";
import CurrencySelect from "./CurrencySelect";
import translations from "./translations.json";
import TopBar from "./TopBar";
import CompanyLogo from "../assets/paygo.png";

const ConverterForm = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USDT (TRC20)");
  const [toCurrency, setToCurrency] = useState("Zain Cash");
  const [result, setResult] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [warning, setWarning] = useState("");

  // خريطة العملات
  const currencyMap = {
    "USDT (TRC20)": "USDT",
    "MoneyGo": "MoneyGo",
    "Zain Cash": "IQD",
    "Al-Rafidain": "IQD",
    "FIB": "IQD",
  };

  // أسعار البيع والشراء
  const moneyGoBuy = 1580;   // تشتري من العميل
  const moneyGoSell = 1620;  // تبيع للعميل
  const usdtBuy = 1580;
  const usdtSell = 1520;

  const minUsd = 2;

  const calculateExchange = (amount, from, to) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setWarning("");
      return "";
    }

    const fromCur = currencyMap[from];
    const toCur = currencyMap[to];

    // نفس العملة
    if (from === to) return numericAmount;

    // 💰 MoneyGo → IQD
    if (fromCur === "MoneyGo" && toCur === "IQD") {
      if (numericAmount < minUsd) {
        setWarning("Minimum exchange amount is 2 USD");
        return "";
      }
      setWarning("");
      return (numericAmount * moneyGoBuy).toLocaleString();
    }

    // 💸 IQD → MoneyGo
    if (fromCur === "IQD" && toCur === "MoneyGo") {
      const usd = numericAmount / moneyGoSell;
      if (usd < minUsd) {
        setWarning("Minimum exchange amount is 2 USD");
        return "";
      }
      setWarning("");
      return usd.toFixed(2);
    }

    // 💰 USDT → IQD
    if (fromCur === "USDT" && toCur === "IQD") {
      if (numericAmount < minUsd) {
        setWarning("Minimum exchange amount is 2 USD");
        return "";
      }
      setWarning("");
      return (numericAmount * usdtBuy).toLocaleString();
    }

    // 💸 IQD → USDT
    if (fromCur === "IQD" && toCur === "USDT") {
      const usd = numericAmount / usdtSell;
      if (usd < minUsd) {
        setWarning("Minimum exchange is equivalent to 2 USD");
        return "";
      }
      setWarning("");
      return usd.toFixed(2);
    }

    setWarning("");
    return "";
  };

  // تحديث النتيجة عند تغيير القيم
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const res = calculateExchange(amount, fromCurrency, toCurrency);
      if (res) setResult(`${amount} ${fromCurrency} = ${res} ${toCurrency}`);
      else setResult("");
    }
  }, [amount, fromCurrency, toCurrency, lang]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div style={{ direction: "ltr" }}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="language-select"
        style={{ marginBottom: "10px" }}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>

      <TopBar lang={lang} />

      <div className="company-logo">
        <img src={CompanyLogo} alt="Company Logo" style={{ marginBottom: "15px" }} />
      </div>

      <div className="market-live">
        <span className="live-dot"></span>
        {t.marketNote}
      </div>

      <form className="converter-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">{t.enterAmount}</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-currency-group">
          <div className="form-section">
            <label className="form-label">{t.youSend}</label>
            <CurrencySelect
              selectedCurrency={fromCurrency}
              handleCurrency={(e) => setFromCurrency(e.target.value)}
            />
          </div>

          <div
            className={`swap-icon ${isSwapping ? "rotating" : ""}`}
            onClick={() => {
              setIsSwapping(true);
              handleSwapCurrencies();
              setTimeout(() => setIsSwapping(false), 400);
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17V3m0 0l-4 4m4-4l4 4M17 7v14m0 0l-4-4m4 4l4-4" />
            </svg>
          </div>

          <div className="form-section">
            <label className="form-label">{t.youGet}</label>
            <CurrencySelect
              selectedCurrency={toCurrency}
              handleCurrency={(e) => setToCurrency(e.target.value)}
            />
          </div>
        </div>

        {warning && <p className="warning-text">{warning}</p>}
        <p className="exchange-rate-result">{result}</p>

        <a
          href={
            warning
              ? "#"
              : `https://t.me/alos_69?text=${encodeURIComponent(
                  lang === "ar"
                    ? `مرحباً، أريد بدء عملية تصريف \nالمبلغ ${amount}\nمن: ${fromCurrency}\nإلى: ${toCurrency}`
                    : `Hello, I want to start an exchange \nAmount: ${amount}\nFrom: ${fromCurrency}\nTo: ${toCurrency}`
                )}`
          }
          onClick={(e) => {
            if (warning) e.preventDefault();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className={`exchange-button ${warning ? "disabled" : ""}`}
        >
          💱 {t.startExchange}
        </a>
      </form>
    </div>
  );
};

export default ConverterForm;
