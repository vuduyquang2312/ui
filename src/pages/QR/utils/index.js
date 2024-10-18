export const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

export const fetchBankDetails = (setBankDetails, setLogo) => {
    const savedBank = localStorage.getItem('selectedBank');
    if (savedBank) {
        const parsedBank = JSON.parse(savedBank);
        setBankDetails(parsedBank);
        setLogo(parsedBank.logo);
    }
};