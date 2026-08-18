"use client";

import React from "react";
import { ethiopianPhoneFormat } from "@/lib/ethiopianData";

// ── Stripping rules per data type ──
const STRIP_PATTERNS: Record<string, RegExp> = {
  name: /[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\s\.\-'\u0027]/g,
  letters: /[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s]/g,
  text: /[^A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF\s\.\-'\u0027,#&()+/:]/g,
  phone: /[^0-9+\-\s()]/g,
  email: /[^A-Za-z0-9@.\-_+]/g,
  url: /[^A-Za-z0-9:\/\.\-_~/?#\[\]@!$&'()*+,;=%]/g,
};

function stripChars(value: string, type: string): string {
  const pattern = STRIP_PATTERNS[type];
  if (!pattern) return value;
  return value.replace(pattern, "");
}

// ── Input ──
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  validate?: (value: string) => string;
}

export function Input({ label, error, hint, validate, className = "", ...props }: InputProps) {
  const [localError, setLocalError] = React.useState("");

  const handleBlur = () => {
    if (validate && props.value && typeof props.value === "string") {
      setLocalError(validate(props.value));
    } else if (props.required && (!props.value || (typeof props.value === "string" && props.value.trim() === ""))) {
      setLocalError("This field is required");
    } else {
      setLocalError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localError) setLocalError("");
    props.onChange?.(e);
  };

  const displayError = error || localError;

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
          displayError ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {hint && !displayError && <p className="text-gray-400 text-[10px] mt-0.5">{hint}</p>}
      {displayError && <p className="text-red-500 text-[11px] mt-1">{displayError}</p>}
    </div>
  );
}

// ── Format validation ──
function validateFormat(value: string, type: string): string {
  if (!value || value.trim() === "") return "";
  switch (type) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Enter a valid email (e.g. name@example.com)";
      return "";
    }
    case "url": {
      // Allow empty (handled above). Must have a dot and no spaces
      if (/\s/.test(value)) return "URL cannot contain spaces";
      if (!value.includes(".")) return "Enter a valid URL (e.g. https://example.com)";
      return "";
    }
    default:
      return "";
  }
}

// ── Date validation ──
export function validateDate(value: string): string {
  if (!value || value.trim() === "") return "";
  const dateRegex = /^\d{4}-\d{2}$/;
  if (!dateRegex.test(value)) return "Use format YYYY-MM (e.g. 2024-01)";
  const [year, month] = value.split("-").map(Number);
  if (year < 1900 || year > 2099) return "Year must be between 1900 and 2099";
  if (month < 1 || month > 12) return "Month must be between 01 and 12";
  return "";
}

// ── TextInput (auto-strips invalid characters) ──
interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  dataType?: "name" | "letters" | "text" | "phone" | "email" | "url";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  maxLength?: number;
  className?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export function TextInput({ label, value, onChange, dataType = "text", required, placeholder, hint, error, maxLength, className = "", onKeyDown }: TextInputProps) {
  const [localError, setLocalError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (dataType) raw = stripChars(raw, dataType);
    if (maxLength && raw.length > maxLength) raw = raw.slice(0, maxLength);
    onChange(raw);

    // Validate format on change
    const formatError = validateFormat(raw, dataType);
    setLocalError(formatError);
  };

  const handleBlur = () => {
    const formatError = validateFormat(value, dataType);
    setLocalError(formatError);
  };

  const displayError = error || localError;

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={dataType === "email" ? "email" : dataType === "url" ? "url" : "text"}
        inputMode={dataType === "phone" ? "tel" : dataType === "email" ? "email" : dataType === "url" ? "url" : "text"}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
          displayError ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {hint && !displayError && <p className="text-gray-400 text-[10px] mt-0.5">{hint}</p>}
      {displayError && <p className="text-red-500 text-[11px] mt-1">{displayError}</p>}
    </div>
  );
}

// ── PhoneInput (country code + number only) ──
const COUNTRY_CODES = [
  { code: "+251", label: "Ethiopia 🇪🇹", digits: 9 },
  { code: "+1", label: "USA 🇺🇸", digits: 10 },
  { code: "+44", label: "UK 🇬🇧", digits: 10 },
  { code: "+91", label: "India 🇮🇳", digits: 10 },
  { code: "+971", label: "UAE 🇦🇪", digits: 9 },
  { code: "+254", label: "Kenya 🇰🇪", digits: 9 },
  { code: "+256", label: "Uganda 🇺🇬", digits: 9 },
  { code: "+255", label: "Tanzania 🇹🇿", digits: 9 },
  { code: "+27", label: "South Africa 🇿🇦", digits: 9 },
  { code: "+20", label: "Egypt 🇪🇬", digits: 10 },
  { code: "+234", label: "Nigeria 🇳🇬", digits: 10 },
  { code: "+225", label: "Côte d'Ivoire 🇨🇮", digits: 10 },
  { code: "+237", label: "Cameroon 🇨🇲", digits: 9 },
  { code: "+236", label: "Central Africa 🇨🇫", digits: 9 },
  { code: "+49", label: "Germany 🇩🇪", digits: 11 },
  { code: "+33", label: "France 🇫🇷", digits: 9 },
  { code: "+86", label: "China 🇨🇳", digits: 11 },
  { code: "+81", label: "Japan 🇯🇵", digits: 10 },
  { code: "+82", label: "South Korea 🇰🇷", digits: 10 },
  { code: "+61", label: "Australia 🇦🇺", digits: 9 },
  { code: "+55", label: "Brazil 🇧🇷", digits: 11 },
  { code: "+52", label: "Mexico 🇲🇽", digits: 10 },
  { code: "+966", label: "Saudi Arabia 🇸🇦", digits: 9 },
];

interface PhoneInputProps {
  label: string;
  countryCode: string;
  phoneNumber: string;
  onChangeCountryCode: (code: string) => void;
  onChangePhoneNumber: (number: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export function PhoneInput({ label, countryCode, phoneNumber, onChangeCountryCode, onChangePhoneNumber, required, placeholder, hint, error, className = "" }: PhoneInputProps) {
  const [localError, setLocalError] = React.useState("");

  const expectedDigits = COUNTRY_CODES.find((c) => c.code === countryCode)?.digits || 9;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const hadNonDigits = /[^0-9]/.test(input);
    let raw = input.replace(/[^0-9]/g, "");
    if (raw.length > 15) raw = raw.slice(0, 15);
    onChangePhoneNumber(raw);

    if (hadNonDigits) {
      setLocalError("Only numbers allowed — letters and symbols removed");
    } else if (raw.length > 0 && raw.length < expectedDigits) {
      setLocalError(`Expected ${expectedDigits} digits for ${countryCode}`);
    } else if (raw.length > expectedDigits) {
      setLocalError(`Too many digits — expected ${expectedDigits}`);
    } else {
      setLocalError("");
    }
  };

  const displayError = error || localError;
  const isEthiopia = countryCode === ethiopianPhoneFormat.countryCode;
  const displayHint = hint || (isEthiopia ? `Format: ${ethiopianPhoneFormat.example}` : undefined);

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => onChangeCountryCode(e.target.value)}
          className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white min-w-[110px]"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} {c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || (isEthiopia ? ethiopianPhoneFormat.example.replace("+251 ", "") : "9XX XXX XXXX")}
          className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
            displayError ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
      </div>
      {displayHint && !displayError && <p className="text-gray-400 text-[10px] mt-0.5">{displayHint}</p>}
      {displayError && <p className="text-red-500 text-xs mt-1">{displayError}</p>}
    </div>
  );
}

// ── Textarea ──
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      <textarea
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Select ──
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── NumberInput ──
interface NumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export function NumberInput({ label, value, onChange, min, max, placeholder, hint, error, className = "" }: NumberInputProps) {
  const [localError, setLocalError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    raw = raw.replace(/[^0-9.\-]/g, "");
    const parts = raw.split(".");
    if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("");
    onChange(raw);

    if (raw === "" || raw === "-") { setLocalError(""); return; }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setLocalError("Please enter a valid number");
    } else if (min !== undefined && num < min) {
      setLocalError(`Minimum value is ${min}`);
    } else if (max !== undefined && num > max) {
      setLocalError(`Maximum value is ${max}`);
    } else {
      setLocalError("");
    }
  };

  const displayError = error || localError;

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
          displayError ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {hint && !displayError && <p className="text-gray-400 text-[10px] mt-0.5">{hint}</p>}
      {displayError && <p className="text-red-500 text-xs mt-1">{displayError}</p>}
    </div>
  );
}
