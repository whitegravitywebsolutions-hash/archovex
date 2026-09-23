import React from 'react';

export default function ProcessSection() {
  const steps = [
    { num: '01', title: 'Consultation', desc: 'Meet our senior interior architect to discuss your lifestyle, budget, and design preferences.' },
    { num: '02', title: 'Design Concept', desc: 'Curated moodboards, material palettes, and 2D floorplan space optimization.' },
    { num: '03', title: '3D Visualization', desc: 'Photorealistic 3D VR renders showing exact colors, lighting, and finishes.' },
    { num: '04', title: 'Precision Execution', desc: 'Precision factory production of modular cabinets and clean on-site assembly.' },
    { num: '05', title: 'Handover', desc: 'Final deep cleaning, 148-point quality check, and key handover with 10-year warranty.' },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            HOW WE WORK
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our 5-Step Design Process</h2>
          <p className="text-xs text-slate-600">
            From initial concept to final key handover, experience a transparent, hassle-free interior journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
            >
              <span className="text-4xl font-extrabold text-blue-600/20 group-hover:text-blue-600 transition-colors block">
                {step.num}
              </span>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
