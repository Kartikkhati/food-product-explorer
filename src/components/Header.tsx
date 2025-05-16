import React, { useState } from 'react';
import { Search, Barcode, MenuIcon, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch: (query: string) => void;
  onBarcodeSearch: (barcode: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onBarcodeSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'barcode'>('name');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'name' && searchQuery.trim()) {
      onSearch(searchQuery);
    } else if (searchMode === 'barcode' && barcodeQuery.trim()) {
      onBarcodeSearch(barcodeQuery);
    }
  };

  const toggleSearchMode = (mode: 'name' | 'barcode') => {
    setSearchMode(mode);
    setSearchQuery('');
    setBarcodeQuery('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-400 to-emerald-600 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-white font-bold text-xl">
              FoodFinder
            </div>
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="flex items-center bg-white rounded-l-lg px-3 border-r border-gray-300">
                <button 
                  type="button" 
                  onClick={() => toggleSearchMode('name')}
                  className={`py-2 px-2 text-sm font-medium ${searchMode === 'name' ? 'text-emerald-600' : 'text-gray-500'}`}
                >
                  <Search size={18} />
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleSearchMode('barcode')}
                  className={`py-2 px-2 text-sm font-medium ${searchMode === 'barcode' ? 'text-emerald-600' : 'text-gray-500'}`}
                >
                  <Barcode size={18} />
                </button>
              </div>
              <input
                type={searchMode === 'barcode' ? 'number' : 'text'}
                placeholder={searchMode === 'name' ? "Search products by name..." : "Enter barcode..."}
                className="w-full py-2 px-4 outline-none text-gray-700 rounded-r-lg focus:ring-2 focus:ring-emerald-500"
                value={searchMode === 'name' ? searchQuery : barcodeQuery}
                onChange={(e) => searchMode === 'name' ? setSearchQuery(e.target.value) : setBarcodeQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg ml-2 hover:bg-emerald-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="flex flex-col gap-2">
              <div className="flex items-center bg-white rounded-lg">
                <div className="flex items-center rounded-l-lg px-3 border-r border-gray-300">
                  <button 
                    type="button" 
                    onClick={() => toggleSearchMode('name')}
                    className={`py-2 px-2 text-sm font-medium ${searchMode === 'name' ? 'text-emerald-600' : 'text-gray-500'}`}
                  >
                    <Search size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => toggleSearchMode('barcode')}
                    className={`py-2 px-2 text-sm font-medium ${searchMode === 'barcode' ? 'text-emerald-600' : 'text-gray-500'}`}
                  >
                    <Barcode size={18} />
                  </button>
                </div>
                <input
                  type={searchMode === 'barcode' ? 'number' : 'text'}
                  placeholder={searchMode === 'name' ? "Search products by name..." : "Enter barcode..."}
                  className="w-full py-2 px-4 outline-none text-gray-700 rounded-r-lg"
                  value={searchMode === 'name' ? searchQuery : barcodeQuery}
                  onChange={(e) => searchMode === 'name' ? setSearchQuery(e.target.value) : setBarcodeQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="bg-white text-emerald-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;