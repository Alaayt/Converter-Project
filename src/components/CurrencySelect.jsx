//import React from "react";

// مصفوفة العملات مع روابط الصور
const currencies = [
  { code: "USDT (TRC20)", logo: "/logos/USDT.png" },
  { code: "MoneyGo", logo: "/logos/Go.png" },
  { code: "Zain Cash", logo: "/logos/zain.png" },
  { code: "Al-Rafidain", logo: "/logos/qi.png" }
];

const CurrencySelect = ({ selectedCurrency, handleCurrency }) => {
  // العثور على الصورة الخاصة بالعملة المحددة حاليًا
  const selected = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="currency-select">
      {/* شعار العملة المختارة */}
      {selected && (
        <img
          src={selected.logo}
          alt={selected.code}
          style={{
            width: "25px",
            height: "25px",
            marginRight: "8px",
            borderRadius: "4px"
          }}
        />
      )}

      {/* قائمة العملات */}
      <select
        onChange={handleCurrency}
        className="currency-dropdown"
        value={selectedCurrency}
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelect;
