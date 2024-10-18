import React, { useState, useEffect } from 'react';
import { IoSettingsOutline, IoCloseOutline } from "react-icons/io5";
import BankSearch from './QR/BankSearch';
import QRForm from './QR/QRForm';
import QRSettings from './QR/QRSettings';

export default function QR() {
  const [showOptions, setShowOptions] = useState(false); 
  const [showForm, setShowForm] = useState(true);
  const [selectedOption, setSelectedOption] = useState(''); 
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedBin, setSelectedBin] = useState('');

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setShowForm(false);
  };

  const closeOptions = () => {
    setShowOptions(false);
    setShowForm(true);
  };

  const handleConfirm = () => {
    localStorage.setItem('selectedOption', selectedOption);
    localStorage.setItem('selectedTemplate', selectedTemplate);
    localStorage.setItem('selectedBin', selectedBin);
    setShowOptions(false);
    setShowForm(true);
  };

  return (
    <div className="p-2 flex flex-col">
      <div className="flex h-full justify-between mb-4 w-full">
        <BankSearch />
        <div
          className="cursor-pointer ml-4 w-1/3 flex justify-center items-center md:px-8 py-4 bg-white text-xs md:text-sm text-[#51887d]  rounded-md transition-all"
          onClick={toggleOptions}
        >
          <IoSettingsOutline className='mr-2' />
          Cài đặt
        </div>
      </div>

      {showOptions && (
        <QRSettings
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          selectedBin={selectedBin}
          setSelectedBin={setSelectedBin}
          closeOptions={closeOptions}
          handleConfirm={handleConfirm}
        />
      )}

      {showForm && (
        <QRForm
          selectedOption={selectedOption}
          selectedTemplate={selectedTemplate}
          selectedBin={selectedBin}
        />
      )}
    </div>
  );
}
