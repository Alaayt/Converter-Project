import { useState, useEffect } from "react";
import CurrencySelect from "./CurrencySelect";
import translations from "./translations.json";

const ConverterForm = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [isSwapping, setIsSwapping] = useState(false);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

<div
  className={`swap-icon ${isSwapping ? "rotating" : ""}`}
  onClick={() => {
    setIsSwapping(true);
    handleSwapCurrencies();
    setTimeout(() => setIsSwapping(false), 400); // مدة الأنيميشن
  }}
>
  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 17V3m0 0l-4 4m4-4l4 4M17 7v14m0 0l-4-4m4 4l4-4"
      stroke="#fff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
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
    lang === "ar"
      ? `مرحباً، أريد بدء عملية تصريف \nالمبلغ ${amount}\nمن: ${fromCurrency}\nإلى: ${toCurrency}`
      : `Hello, I want to start an exchange \nAmount: ${amount}\nFrom: ${fromCurrency}\nTo: ${toCurrency}`
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
