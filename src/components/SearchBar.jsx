import { MagnifyingGlass } from "@phosphor-icons/react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Pesquisar por nome e ID.",
}) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 text-2xl border-2 border-gray_primary rounded-full focus:outline-none focus:border-blue_secondary"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlass size={28} className="text-gray_primary" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
