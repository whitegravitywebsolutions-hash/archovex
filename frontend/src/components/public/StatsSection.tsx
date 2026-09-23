import React from 'react';

export default function StatsSection() {
  const stats = [
    { value: '2,500+', label: 'Projects Completed' },
    { value: '6+', label: 'Cities Served' },
    { value: '100%', label: 'Custom Designs' },
    { value: '10 Years', label: 'Material Warranty' },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white py-14 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-blue-300 tracking-tight block">
              {stat.value}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300 block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
