import React, { useState, useEffect, useRef } from 'react';
import useSearch from '../hooks/useSearch'; // Assuming this path is correct

const CountryStateSearch = ({
  onSelectCountry,
  onSelectState,
  selectedCountry: initialSelectedCountryValue, // Renamed to avoid conflict with internal state
  selectedState: initialSelectedStateValue // Renamed to avoid conflict with internal state
}) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Refs for closing dropdowns when clicking outside
  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);

  const countrySearch = useSearch(async (query) => {
    const res = await fetch(`/api/countries?search=${query}`);
    return res.ok ? await res.json() : [];
  });

  const stateSearch = useSearch(async (query) => {
    // Only search for states if a country is selected
    if (!selectedCountry?.code) return [];
    const res = await fetch(`/api/states?country=${selectedCountry.code}&search=${query}`);
    return res.ok ? await res.json() : [];
  });

  // ✅ Pre-fill country and state on initial render or when parent values change
  useEffect(() => {
    // Set country
    if (initialSelectedCountryValue) {
      // Assuming initialSelectedCountryValue is just the name string (e.g., "India")
      // We need to set it as an object that matches the structure from countrySearch results
      setSelectedCountry({ name: initialSelectedCountryValue, code: initialSelectedCountryValue }); // Assuming 'code' is the same as name for simplicity, adjust if your API provides a real code
      countrySearch.setQuery(initialSelectedCountryValue); // Set useSearch's internal query to match
    } else {
      setSelectedCountry(null);
      countrySearch.setQuery('');
    }
  }, [initialSelectedCountryValue]); // Depend on the prop for country

  useEffect(() => {
    // Set state, only if a country is already selected/pre-filled
    if (initialSelectedStateValue && selectedCountry) {
      // Assuming initialSelectedStateValue is just the name string (e.g., "Maharashtra")
      setSelectedState({ name: initialSelectedStateValue, _id: initialSelectedStateValue }); // Assuming _id is same as name, adjust if your API provides a real _id
      stateSearch.setQuery(initialSelectedStateValue); // Set useSearch's internal query to match
    } else {
      setSelectedState(null);
      stateSearch.setQuery('');
    }
  }, [initialSelectedStateValue, selectedCountry]); // Depend on the prop for state AND the internal selectedCountry state


  // --- Handle clicks outside dropdowns ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    countrySearch.setQuery(country.name); // Keep input field showing selected country's name
    setSelectedState(null); // Clear state when country changes
    stateSearch.setQuery(''); // Clear state search query
    onSelectCountry(country); // Inform parent component
    onSelectState(null); // Also inform parent that state is cleared
    setShowCountryDropdown(false);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    stateSearch.setQuery(state.name); // Keep input field showing selected state's name
    onSelectState(state); // Inform parent component
    setShowStateDropdown(false);
  };

  // --- Input change handlers ---
  const handleCountryInputChange = (e) => {
    const value = e.target.value;
    countrySearch.handleSearch(value); // Trigger search
    countrySearch.setQuery(value); // Update internal query for display
    setSelectedCountry(null); // Clear selected country if user types
    setSelectedState(null); // Also clear selected state
    onSelectCountry(null); // Inform parent
    onSelectState(null); // Inform parent
    setShowCountryDropdown(true); // Show dropdown
  };

  const handleStateInputChange = (e) => {
    const value = e.target.value;
    stateSearch.handleSearch(value); // Trigger search
    stateSearch.setQuery(value); // Update internal query for display
    setSelectedState(null); // Clear selected state if user types
    onSelectState(null); // Inform parent
    setShowStateDropdown(true); // Show dropdown
  };


  return (
    <div>
      {/* Country Search */}
      <div ref={countryDropdownRef} className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
        <input
          type="text"
          placeholder="Search Country"
          value={selectedCountry?.name || countrySearch.query} // Display selected name or search query
          onChange={handleCountryInputChange}
          onFocus={() => setShowCountryDropdown(true)}
          className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          required // Mark as required
        />
        {showCountryDropdown && (
          <div className="absolute border bg-white w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-md mt-1">
            {countrySearch.loading && <p className="p-2 text-gray-600">Loading...</p>}
            {countrySearch.results.length === 0 && !countrySearch.loading && (
                <p className="p-2 text-gray-500">No countries found.</p>
            )}
            {countrySearch.results.map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedCountry?.code === country.code ? 'bg-blue-100' : ''
                }`}
              >
                {country.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Search */}
      <div ref={stateDropdownRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
        <input
          type="text"
          placeholder="Search State"
          value={selectedState?.name || stateSearch.query} // Display selected name or search query
          onChange={handleStateInputChange}
          onFocus={() => setShowStateDropdown(true)}
          className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!selectedCountry} // Disable if no country is selected
          required // Mark as required
        />
        {showStateDropdown && selectedCountry && ( // Only show state dropdown if a country is selected
          <div className="absolute border bg-white w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-md mt-1">
            {stateSearch.loading && <p className="p-2 text-gray-600">Loading...</p>}
            {stateSearch.results.length === 0 && !stateSearch.loading && (
                <p className="p-2 text-gray-500">No states found for selected country.</p>
            )}
            {stateSearch.results.map((state) => (
              <div
                key={state._id}
                onClick={() => handleStateSelect(state)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedState?._id === state._id ? 'bg-blue-100' : ''
                }`}
              >
                {state.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryStateSearch;






// import React, { useState } from 'react';
// import useSearch from '../hooks/useSearch';

// const CountryStateSearch = ({ onSelectCountry, onSelectState }) => {
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [showStateDropdown, setShowStateDropdown] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);

//   const countrySearch = useSearch(async (query) => {
//     const res = await fetch(`/api/countries?search=${query}`);
//     return res.ok ? await res.json() : [];
//   });

//   const stateSearch = useSearch(async (query) => {
//     const res = await fetch(`/api/states?country=${selectedCountry?.code}&search=${query}`);
//     return res.ok ? await res.json() : [];
//   });

//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     setSelectedState(null); // Reset state if the country changes
//     onSelectCountry(country); // Prop callback
//     setShowCountryDropdown(false); // Hide dropdown
//   };

//   const handleStateSelect = (state) => {
//     setSelectedState(state);
//     onSelectState(state); // Prop callback
//     setShowStateDropdown(false); // Hide dropdown
//   };

//   return (
//     <div>
//       {/* Country Search */}
//       <div className="relative mb-4">
//         <input
//           type="text"
//           placeholder="Search Country"
//           value={selectedCountry?.name || countrySearch.query}
//           onChange={(e) => {
//             countrySearch.handleSearch(e.target.value);
//             setShowCountryDropdown(true);
//           }}
//           onFocus={() => setShowCountryDropdown(true)}
//           className="border px-4 py-2 w-full"
//         />
//         {showCountryDropdown && (
//           <div className="absolute border bg-white w-full max-h-40 overflow-y-auto z-10">
//             {countrySearch.loading && <p className="p-2">Loading...</p>}
//             {countrySearch.results.map((country) => (
//               <div
//                 key={country.code}
//                 onClick={() => handleCountrySelect(country)}
//                 className={`p-2 cursor-pointer hover:bg-gray-200 ${
//                   selectedCountry?.code === country.code ? 'bg-blue-100' : ''
//                 }`}
//               >
//                 {country.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* State Search */}
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search State"
//           value={selectedState?.name || stateSearch.query}
//           onChange={(e) => {
//             stateSearch.handleSearch(e.target.value);
//             setShowStateDropdown(true);
//           }}
//           onFocus={() => setShowStateDropdown(true)}
//           className="border px-4 py-2 w-full"
//           disabled={!selectedCountry} // Disable state search if no country is selected
//         />
//         {showStateDropdown && selectedCountry && (
//           <div className="absolute border bg-white w-full max-h-40 overflow-y-auto z-10">
//             {stateSearch.loading && <p className="p-2">Loading...</p>}
//             {stateSearch.results.map((state) => (
//               <div
//                 key={state._id}
//                 onClick={() => handleStateSelect(state)}
//                 className={`p-2 cursor-pointer hover:bg-gray-200 ${
//                   selectedState?._id === state._id ? 'bg-blue-100' : ''
//                 }`}
//               >
//                 {state.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CountryStateSearch;
