'use client';

import React from 'react';
import Link from 'next/link';
import { City } from '@/types';

interface CityMegaMenuProps {
  cities?: City[];
  isOpen: boolean;
  onClose: () => void;
}

const ALL_INDIAN_CITIES = [
  'Agra', 'Ahilyanagar', 'Ahmedabad', 'Aizawl', 'Aligarh', 'Amritsar', 'Anand', 'Asansol', 'Aurangabad', 'Ayodhya',
  'Banswara', 'Baramulla', 'Beed', 'Belgaum', 'Bengaluru', 'Bhilai', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur',
  'Chandigarh', 'Chandrapur', 'Chennai', 'Chikkamagaluru', 'Coimbatore', 'Cuttack',
  'Dehradun', 'Delhi', 'Dhanbad', 'Dibrugarh', 'Durg', 'Faridabad',
  'Gandhinagar', 'Gaya', 'Ghaziabad', 'Ghumarwin', 'Goa', 'Godhra', 'Gurugram', 'Guwahati', 'Gwalior',
  'Hamirpur', 'Hosapete', 'Hubli', 'Hyderabad',
  'Indore',
  'Jabalpur', 'Jagdalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamshedpur', 'Jigani', 'Jodhpur',
  'Kadapa', 'Kakinada', 'Kangra', 'Kanpur', 'Karimnagar', 'Karur', 'Khammam', 'Kochi', 'Kolhapur', 'Kolkata', 'Kozhikode',
  'Latur', 'Lucknow', 'Ludhiana',
  'Madurai', 'Mandi', 'Mangalore', 'Mansoorabad', 'Meerut', 'Mehsana', 'Moradabad', 'Mumbai', 'Mysore',
  'Nagercoil', 'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nawanshahr', 'Neemuch', 'Nizamabad', 'Noida',
  'Ongole',
  'Patiala', 'Patna', 'Pondicherry', 'Pune',
  'Raebareli', 'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rewa', 'Rewari', 'Rudrapur',
  'Salem', 'Sangareddy', 'Sangli', 'Shivamogga', 'Siliguri', 'Singrauli', 'Sivakasi', 'Solapur', 'Srikakulam', 'Srinagar', 'Surat',
  'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Turnkuru',
  'Udaipur', 'Udupi', 'Ujjain',
  'Vadodara', 'Varanasi', 'Vellore', 'Vijayapur', 'Vijayawada', 'Visakhapatnam',
  'Warangal'
];

export default function CityMegaMenu({ cities = [], isOpen, onClose }: CityMegaMenuProps) {
  if (!isOpen) return null;

  // Combine database cities with default Indian cities
  const cityMap = new Map<string, { name: string; slug: string }>();

  // Add DB cities first
  cities.forEach((c) => {
    if (c.name) {
      cityMap.set(c.name.toLowerCase(), {
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  });

  // Add static Indian cities
  ALL_INDIAN_CITIES.forEach((cityName) => {
    const key = cityName.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, {
        name: cityName,
        slug: cityName.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  });

  // Convert map to sorted array
  const cityList = Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 w-[1150px] max-w-[96vw] bg-white text-slate-900 border border-t-0 border-slate-200/90 shadow-2xl rounded-b-2xl p-6 lg:p-8 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-2.5 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
        {cityList.map((c) => (
          <Link
            key={c.slug}
            href={`/cities/${c.slug}`}
            onClick={onClose}
            className="text-[12px] font-medium text-slate-800 hover:text-black hover:font-bold transition-all truncate block py-0.5"
            title={c.name}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
