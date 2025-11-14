import USDT from "../assets/logos/USDT.png";
import Go from "../assets/logos/Go.png";
import Zain from "../assets/logos/zain.png";
import Qi from "../assets/logos/qi.png";

const currencies = [
  { code: "USDT (TRC20)", logo: USDT },
  { code: "MoneyGo", logo: Go },
  { code: "Zain Cash", logo: Zain },
  { code: "Al-Rafidain", logo: Qi }
];

const CurrencySelect = ({ selectedCurrency, handleCurrency }) => {
  const selected = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="currency-select">
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
