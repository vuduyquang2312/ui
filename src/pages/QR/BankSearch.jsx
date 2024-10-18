import React, { useState, useEffect } from 'react';

export default function BankSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [banks, setBanks] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.vietqr.io/v2/banks');
        const data = await response.json();
        if (data.code === "00") {
          setBanks(data.data);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    fetchBanks();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setSearchValue(value);

    if (value === "") {
      setSearchResult([]);
      setSelectedBank(null);
      return;
    }

    const results = banks.filter(bank =>
      bank.bin.includes(value) ||
      bank.name.toLowerCase().includes(value.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(value.toLowerCase()) ||
      bank.short_name.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResult(results);
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setSearchValue(bank.name);
    setSearchResult([]);

    // Save selected bank details to localStorage
    localStorage.setItem('selectedBank', JSON.stringify({
      name: bank.name,
      logo: bank.logo,
      bin: bank.bin
    }));
  };

  return (
    <div className="relative w-3/4">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        placeholder="Nhập tên ngân hàng/BIN"
        className="block w-full px-8 py-4 text-[#51887d] text-xs md:text-sm rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
      />
      {selectedBank && (
        <img
          src={selectedBank.logo}
          alt={selectedBank.name}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-16 h-auto"
        />
      )}
      {/* Move searchResult outside the input container */}
      {searchResult.length > 0 && (
        <div className="absolute mt-2 w-full max-w-[100%] bg-white border rounded-xl shadow-lg z-10">
          <div className="flex flex-col border rounded-xl bg-white" style={{ maxHeight: '275px', overflowY: 'auto' }}>
            {searchResult.map((result, index) => (
              <div
                key={index}
                className="flex items-center w-full bg-white p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectBank(result)}
              >
                <img src={result.logo} alt={result.name} className="w-16 h-auto mr-4" />
                <div className="flex flex-col text-gray-500 text-xs md:text-sm">
                  <p>
                    <span>({result.bin}):</span> {result.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
