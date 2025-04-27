import { MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";

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
          className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray_primary rounded-md focus:outline-none focus:border-blue_secondary"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlass size={25} className="text-gray_primary" />
        </div>
        <div className="absolute right-3 top-7 transform -translate-y-1/2">
          <SlidersHorizontal
            size={30}
            className="text-gray_primary cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
