import ConverterForm from "./components/ConverterForm";
import bgImage from "./assets/bg.png";

const App = () => {
  return (
    <div
      className="currency-converter"
      style={{
        background: `url(${bgImage}) no-repeat center`,
        backgroundSize: "cover", // أو "contain" إذا لا تريدها تغطي كل العنصر
      }}
    >
      <h2 className="converter-title">Currency Converter</h2>
      <ConverterForm />
    </div>
  );
};

export default App;
