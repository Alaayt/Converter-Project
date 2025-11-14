import { useState, useEffect } from "react";
import CurrencySelect from "./CurrencySelect";
import translations from "./translations.json";

const ConverterForm = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USDT (TRC20)");
  const [toCurrency, setToCurrency] = useState("Zain Cash");
  const [result, setResult] = useState("");
  const [rates, setRates] = useState(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rates.json`) // مسار ديناميكي حسب البيئة
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch((err) => console.error("خطأ في تحميل الأسعار:", err));
  }, []);

  const normalizeCurrency = (currency) => {
    if (currency === "Zain Cash" || currency === "Al-Rafidain") return "IQD";
    return currency;
  };

  const calculateExchange = (amount, from, to) => {
    if (!rates) return "جاري تحميل الأسعار...";

    const fromCur = normalizeCurrency(from);
    const toCur = normalizeCurrency(to);

    const minAmount = rates[fromCur]?.minAmount || 0;

    if (amount < minAmount) {
      setWarning(
        lang === "ar"
          ? ` ${fromCur} أقل مبلغ للصرف  ${minAmount}`
          : `⚠️ Minimum amount for ${fromCur} is ${minAmount}`
      );
      return "";
    } else {
      setWarning("");
    }

    if (fromCur === toCur) return amount;

    const isSellingToUs = fromCur !== "IQD";
    const type = isSellingToUs ? "buy" : "sell";

    const rate = rates[fromCur]?.[type]?.[toCur];
    if (!rate) return lang === "ar" ? "السعر غير متاح" : "Rate not available";

    const converted = amount * rate;
    return converted.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const res = calculateExchange(amount, fromCurrency, toCurrency);
      if (res) setResult(`${amount} ${fromCurrency} = ${res} ${toCurrency}`);
      else setResult("");
    }
  }, [amount, fromCurrency, toCurrency, rates, lang]);

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
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>

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

          <div className="swap-icon" onClick={handleSwapCurrencies}>
            <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                fill="#fff"
              />
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
          href={`https://t.me/Alaayt?text=${encodeURIComponent(
            `${t.startExchange}: ${amount} ${fromCurrency} → ${toCurrency}`
          )}`}
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
