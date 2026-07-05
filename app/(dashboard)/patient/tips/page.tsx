"use client";

/**
 * Patient Health Tips Page
 *
 * Static curated tips with a working category filter.
 * Tips are evidence-based and cover all major health categories.
 */

import { useState } from "react";

type TipCategory = "Nutrition" | "Fitness" | "Mental Health" | "Sleep" | "Preventive";

interface HealthTip {
  id: number;
  title: string;
  body: string;
  category: TipCategory;
  icon: string;
  readTime: string;
}

// ─── Tips data ────────────────────────────────────────────────────────────────
const tips: HealthTip[] = [
  {
    id: 1,
    title: "Stay Hydrated Throughout the Day",
    body: "Aim for 8–10 glasses of water daily. Carry a reusable bottle and set hourly reminders. Proper hydration boosts energy, aids digestion, and improves skin health.",
    category: "Nutrition",
    icon: "💧",
    readTime: "2 min",
  },
  {
    id: 2,
    title: "30-Minute Daily Walk",
    body: "A brisk 30-minute walk reduces the risk of heart disease by up to 35%. Start with 10 minutes after each meal if a continuous 30-minute block feels difficult.",
    category: "Fitness",
    icon: "🚶",
    readTime: "2 min",
  },
  {
    id: 3,
    title: "Prioritise Quality Sleep",
    body: "Adults need 7–9 hours of uninterrupted sleep. Keep a consistent sleep schedule, avoid screens 1 hour before bed, and keep your bedroom cool and dark.",
    category: "Sleep",
    icon: "😴",
    readTime: "3 min",
  },
  {
    id: 4,
    title: "Eat a Rainbow of Vegetables",
    body: "Different coloured vegetables contain different phytonutrients. Fill half your plate with vegetables at each meal to cover a wide spectrum of vitamins and antioxidants.",
    category: "Nutrition",
    icon: "🥦",
    readTime: "2 min",
  },
  {
    id: 5,
    title: "Practise the 4-7-8 Breathing Technique",
    body: "Inhale for 4 seconds, hold for 7, exhale for 8. This activates your parasympathetic nervous system and reduces anxiety within minutes. Do it twice daily.",
    category: "Mental Health",
    icon: "🧘",
    readTime: "3 min",
  },
  {
    id: 6,
    title: "Schedule Annual Health Screenings",
    body: "Regular check-ups catch problems early. Adults should have yearly blood pressure, cholesterol, and blood sugar checks. Book your next appointment before you need one.",
    category: "Preventive",
    icon: "🩺",
    readTime: "2 min",
  },
  {
    id: 7,
    title: "Strength Train Twice a Week",
    body: "Resistance training preserves muscle mass, improves bone density, and boosts metabolism. Even two 20-minute sessions per week produce significant long-term benefits.",
    category: "Fitness",
    icon: "💪",
    readTime: "3 min",
  },
  {
    id: 8,
    title: "Limit Added Sugar Intake",
    body: "The WHO recommends less than 25 g (6 teaspoons) of added sugar per day. Check food labels carefully — added sugars hide in sauces, bread, yoghurt, and juices.",
    category: "Nutrition",
    icon: "🍬",
    readTime: "2 min",
  },
  {
    id: 9,
    title: "Connect Socially Every Day",
    body: "Social connection is as important for longevity as diet and exercise. Even a brief daily call or message to a friend or family member meaningfully reduces stress hormones.",
    category: "Mental Health",
    icon: "🤝",
    readTime: "2 min",
  },
];

// ─── Category styles ──────────────────────────────────────────────────────────
const categoryStyles: Record<TipCategory, { badge: string; iconBg: string; border: string }> = {
  "Nutrition":     { badge: "bg-aq-faint text-aq-darker",       iconBg: "bg-aq-faint",   border: "border-aq/30"       },
  "Fitness":       { badge: "bg-emerald-50 text-emerald-700",   iconBg: "bg-emerald-50", border: "border-emerald-200" },
  "Mental Health": { badge: "bg-violet-50 text-violet-700",     iconBg: "bg-violet-50",  border: "border-violet-200"  },
  "Sleep":         { badge: "bg-sky-50 text-sky-700",           iconBg: "bg-sky-50",     border: "border-sky-200"     },
  "Preventive":    { badge: "bg-amber-50 text-amber-700",       iconBg: "bg-amber-50",   border: "border-amber-200"   },
};

const categories: TipCategory[] = ["Nutrition", "Fitness", "Mental Health", "Sleep", "Preventive"];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientHealthTips() {
  // "All" means no filter; otherwise filter by category
  const [activeCategory, setActiveCategory] = useState<TipCategory | "All">("All");

  const filtered =
    activeCategory === "All"
      ? tips
      : tips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Health Tips</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Evidence-based tips to help you stay at your healthiest.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          {filtered.length} of {tips.length} tips
        </span>
      </div>

      {/* ── Category filter ── */}
      <div className="flex flex-wrap gap-2">
        {/* "All" button */}
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeCategory === "All"
              ? "bg-sidebar text-aq"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({tips.length})
        </button>

        {/* Category buttons */}
        {categories.map((cat) => {
          const count = tips.filter((t) => t.category === cat).length;
          const s = categoryStyles[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${s.badge} ${s.border} ${
                isActive ? "ring-2 ring-offset-1 ring-current" : "opacity-70 hover:opacity-100"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Tip cards ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4 gap-3">
          <p className="text-sm font-semibold text-gray-700">No tips in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tip) => {
            const style = categoryStyles[tip.category];
            return (
              <div
                key={tip.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-aq/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {tip.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge} ${style.border}`}>
                      {tip.category}
                    </span>
                    <span className="text-xs text-gray-400">{tip.readTime} read</span>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-ink leading-snug">{tip.title}</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
