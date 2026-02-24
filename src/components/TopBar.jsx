

const TopBar = ({ lang }) => {

  return (
    <div className="top-bar">
      <a
        href="https://wa.me/رقمك?text=مرحبا"
        target="_blank"
        rel="noopener noreferrer"
        className="top-bar-link"
      >
        {lang === "ar" ? "تواصل معي" : "Contact Me"}
      </a>
      <a
        href="https://telegra.ph/صفحة-القوانين-01-01"
        target="_blank"
        rel="noopener noreferrer"
        className="top-bar-link"
      >
        {lang === "ar" ? "القوانين" : "Rules"}
      </a>
      <a
        href="https://telegra.ph/صفحة-من-نحن-01-01"
        target="_blank"
        rel="noopener noreferrer"
        className="top-bar-link"
      >
        {lang === "ar" ? "من نحن" : "About Us"}
      </a>
    </div>
  );
};

export default TopBar;