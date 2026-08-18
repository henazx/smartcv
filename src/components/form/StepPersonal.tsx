"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Textarea, PhoneInput } from "./FormInputs";
import { ethiopianCities } from "@/lib/ethiopianData";

function AddressInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const matches = ethiopianCities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-3 relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (value.length >= 2 && filtered.length > 0) setShowSuggestions(true);
        }}
        placeholder="Addis Ababa, Ethiopia"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
          {filtered.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => {
                  onChange(city);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StepPersonal() {
  const { data, setPersonal } = useCVStore();
  const { personal } = data;

  // Parse stored phone: if it starts with +, extract code; otherwise default +251
  const countryCode = personal.phone.match(/^(\+\d{1,4})/)?.[1] || "+251";
  const phoneNumber = personal.phone.replace(/^\+\d{1,4}/, "").replace(/\D/g, "");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPersonal({ photoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-sm">1</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
      </div>

      <TextInput
        label="Full Name"
        required
        value={personal.fullName}
        onChange={(val) => setPersonal({ fullName: val })}
        dataType="name"
        placeholder="e.g. Abebe Kebede"
        maxLength={60}
        hint="Letters, spaces, hyphens, and periods only"
      />
      <TextInput
        label="Professional Headline"
        required
        value={personal.headline}
        onChange={(val) => setPersonal({ headline: val })}
        dataType="text"
        placeholder="e.g. Senior Software Engineer II"
        maxLength={80}
        hint="Numbers and symbols allowed"
      />

      <TextInput
        label="Email"
        required
        value={personal.email}
        onChange={(val) => setPersonal({ email: val })}
        dataType="email"
        placeholder="abebe@example.com"
        hint="Professional email preferred"
      />

      <PhoneInput
        label="Phone"
        required
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onChangeCountryCode={(code) => {
          setPersonal({ phone: code + phoneNumber });
        }}
        onChangePhoneNumber={(num) => {
          setPersonal({ phone: countryCode + num });
        }}
        placeholder="9XX XXX XXXX"
        hint="Digits only — country code selected automatically"
      />

      <AddressInput
        value={personal.address}
        onChange={(val) => setPersonal({ address: val })}
      />

      <Textarea
        label="Professional Summary"
        value={personal.summary}
        onChange={(e) => setPersonal({ summary: e.target.value })}
        placeholder="Brief 2-3 sentence overview of your professional background and goals..."
        hint="Tip: Tailor this to each job application. 50-100 words recommended."
        maxLength={500}
      />

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Online Profiles</h3>
        <TextInput
          label="LinkedIn"
          value={personal.linkedIn}
          onChange={(val) => setPersonal({ linkedIn: val })}
          dataType="url"
          placeholder="linkedin.com/in/abebe"
          hint="Full URL or username: https://linkedin.com/in/yourname"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="GitHub"
            value={personal.github}
            onChange={(val) => setPersonal({ github: val })}
            dataType="text"
            placeholder="github.com/abebe"
            hint="Username or full URL"
          />
          <TextInput
            label="Website / Portfolio"
            value={personal.website}
            onChange={(val) => setPersonal({ website: val })}
            dataType="url"
            placeholder="https://abebe.dev"
            hint="Full URL: https://yoursite.com"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200"
        />
        <p className="text-gray-400 text-[10px] mt-0.5">JPEG, PNG, or WebP. Square images work best.</p>
        {personal.photoUrl && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3">
              <img src={personal.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-900" />
              <button onClick={() => setPersonal({ photoUrl: null })} className="text-xs text-red-500 hover:underline font-medium">Remove</button>
            </div>

            {/* Size slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-gray-500">Size</label>
                <span className="text-[11px] text-gray-400">{personal.photoSize}px</span>
              </div>
              <input
                type="range"
                min={30}
                max={120}
                value={personal.photoSize}
                onChange={(e) => setPersonal({ photoSize: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Position buttons */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 block mb-1">Position</label>
              <div className="flex gap-1.5">
                {(["left", "center", "right"] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPersonal({ photoPosition: pos })}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      personal.photoPosition === pos
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
