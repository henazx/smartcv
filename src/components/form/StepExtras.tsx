"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Input, PhoneInput } from "./FormInputs";

export function StepCertifications() {
  const { data, addCertification, updateCertification, removeCertification } = useCVStore();
  const { certifications } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <span className="text-red-500 font-bold text-sm">C</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - add any professional certifications or licenses.</p>

      {certifications.length === 0 && (
        <p className="text-gray-500 text-sm italic">No certifications added yet.</p>
      )}

      {certifications.map((cert, idx) => (
        <div key={cert.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Certification {idx + 1}</span>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-500 text-sm hover:underline font-medium"
            >
              Remove
            </button>
          </div>

          <TextInput
            label="Certification Name"
            required
            value={cert.name}
            onChange={(val) => updateCertification(cert.id, { name: val })}
            dataType="text"
            placeholder="e.g. AWS Solutions Architect"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput
              label="Issuing Organization"
              value={cert.issuer}
              onChange={(val) => updateCertification(cert.id, { issuer: val })}
              dataType="name"
              placeholder="e.g. Amazon Web Services"
            />
            <Input
              label="Date"
              type="month"
              value={cert.date}
              onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        + Add Certification
      </button>
    </div>
  );
}

export function StepReferences() {
  const { data, addReference, updateReference, removeReference, setIncludeReferences, setShowAvailableUponRequest } = useCVStore();
  const { references, includeReferences, showAvailableUponRequest } = data;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">References</h2>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={includeReferences}
          onChange={(e) => setIncludeReferences(e.target.checked)}
          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
        />
        Include references section in CV
      </label>

      {includeReferences && (
        <>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showAvailableUponRequest}
              onChange={(e) => setShowAvailableUponRequest(e.target.checked)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            Show &quot;Available upon request&quot; instead of listing names
          </label>

          {!showAvailableUponRequest && (
            <>
              {references.map((ref, idx) => (
                <div key={ref.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Reference {idx + 1}</span>
                    <button
                      onClick={() => removeReference(ref.id)}
                      className="text-red-500 text-sm hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <TextInput
                    label="Name"
                    required
                    value={ref.name}
                    onChange={(val) => updateReference(ref.id, { name: val })}
                    dataType="name"
                  />
                  <TextInput
                    label="Title"
                    value={ref.title}
                    onChange={(val) => updateReference(ref.id, { title: val })}
                    dataType="name"
                    placeholder="e.g. Project Manager"
                  />
                  <TextInput
                    label="Email"
                    value={ref.email}
                    onChange={(val) => updateReference(ref.id, { email: val })}
                    dataType="email"
                    placeholder="ref@example.com"
                  />
                  <PhoneInput
                    label="Phone"
                    countryCode={ref.phone.startsWith("+") ? (() => { const m = ref.phone.match(/^(\+\d{1,4})/); return m ? m[1] : "+251"; })() : "+251"}
                    phoneNumber={ref.phone.replace(/^\+\d{1,4}/, "").replace(/\D/g, "")}
                    onChangeCountryCode={(code) => {
                      const num = ref.phone.replace(/^\+\d{1,4}/, "").replace(/\D/g, "");
                      updateReference(ref.id, { phone: code + num });
                    }}
                    onChangePhoneNumber={(num) => {
                      const code = ref.phone.startsWith("+") ? (() => { const m = ref.phone.match(/^(\+\d{1,4})/); return m ? m[1] : "+251"; })() : "+251";
                      updateReference(ref.id, { phone: code + num });
                    }}
                  />
                </div>
              ))}

              <button
                onClick={addReference}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                + Add Reference
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
