import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar({
placeholder = "Cari data..."
}) {
return ( <div className="search-wrapper"> <Search size={16} className="search-icon" />

  <input
    type="text"
    placeholder={placeholder}
    className="search-bar"
  />
</div>

);
}

export default SearchBar;
