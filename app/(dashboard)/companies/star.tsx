import { FaStar } from "react-icons/fa";


export default function StarIconComponent ({ isWatched, onClick, className }) {
    if (isWatched) {
      return (
        <FaStar
          onClick={onClick}
          className={`${className} star active`}
          aria-label="Retirer de la watchlist"
        />
      );
    } else {
      return (
        <FaStar
          className={`${className} star inactive`}
          aria-label="Watchlist indisponible"
        />
      );
    }
  };