"use client";

import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import ContactHeader from "./components/ContactHeader";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import ContactMap from "./components/ContactMap";
import ContactFeatures from "./components/ContactFeatures";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <ContactHeader />

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm
                formData={formData}
                onInputChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              <ContactInfo />
              <ContactMap />
            </div>
          </div>
        </div>
      </section>

      <ContactFeatures />
    </main>
  );
}
