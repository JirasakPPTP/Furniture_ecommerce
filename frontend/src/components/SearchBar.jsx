const SearchBar = ({ value, onChange, placeholder = "ค้นหาสินค้า..." }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 focus:border-brand-500 focus:outline-none"
    />
  );
};

export default SearchBar;
