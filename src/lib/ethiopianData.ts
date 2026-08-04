export const ethiopianCities: string[] = [
  "Addis Ababa", "Dire Dawa", "Mekelle", "Adama (Nazret)", "Gondar",
  "Bahir Dar", "Hawassa", "Jimma", "Dessie", "Jijiga",
  "Shashamane", "Bishoftu (Debre Zeyit)", "Arba Minch", "Harar",
  "Debre Markos", "Debre Birhan", "Axum", "Lalibela",
  "Asella", "Nekemte", "Woldia", "Axum", "Shire",
  "Semera", "Gambella", "Assosa", "Jimma", "Debre Tabor"
];

export const ethiopianPhoneFormat = {
  mobile: "+251 9X XXX XXXX",
  landline: "+251 1X XXX XXXX",
  example: "+251 91 123 4567",
  countryCode: "+251",
  carriers: ["Safaricom", "Telebirr", "Amharic Telecom"]
};

export interface IndustrySuggestion {
  industry: string;
  skills: string[];
  keywords: string[];
  certifications: string[];
  summaryTemplates: string[];
}

export const ethiopianIndustries: IndustrySuggestion[] = [
  {
    industry: "Technology",
    skills: ["JavaScript", "TypeScript", "Python", "React", "Node.js", "SQL", "Git", "REST APIs", "Docker", "AWS", "Linux", "Agile", "Java", "C#", "Machine Learning", "Data Science"],
    keywords: ["software development", "web applications", "cloud computing", "microservices", "CI/CD", "DevOps", "data analytics", "system architecture"],
    certifications: ["AWS Certified", "Google Cloud", "Microsoft Azure", "Cisco CCNA", "CompTIA", "Oracle Certified"],
    summaryTemplates: [
      "Software developer with X years of experience building web applications using modern technologies.",
      "Full-stack developer specializing in React and Node.js with a passion for creating efficient solutions."
    ]
  },
  {
    industry: "Banking & Finance",
    skills: ["Microsoft Excel", "Financial Analysis", "Accounting", "Risk Management", "Compliance", "Customer Service", "Data Analysis", "SQL", "Bloomberg Terminal", "IFRS", "Internal Audit", "Credit Analysis", "Anti-Money Laundering", "Tax Compliance", "Financial Modeling", "Budgeting & Forecasting"],
    keywords: ["financial reporting", "credit analysis", "loan processing", "anti-money laundering", "regulatory compliance", "portfolio management", "financial statements", "bank reconciliation"],
    certifications: ["CFA", "ACCA", "CPA", "FRM", "Ethiopian Insurance Institute", "Certified Bank Auditor"],
    summaryTemplates: [
      "Finance professional with X years of experience in banking operations and regulatory compliance.",
      "Detail-oriented financial analyst with expertise in risk assessment and financial reporting."
    ]
  },
  {
    industry: "NGO & Development",
    skills: ["Project Management", "Monitoring & Evaluation", "Grant Writing", "Report Writing", "Community Engagement", "Data Collection", "Stakeholder Management", "Budget Management", "Gender Analysis", "Environmental Assessment", "Logical Framework Analysis", "Beneficiary Tracking", "Donor Reporting", "Training & Facilitation", "Policy Advocacy", "Baseline Surveys"],
    keywords: ["sustainable development", "community empowerment", "capacity building", "livelihood improvement", "food security", "health programs", "poverty reduction", "humanitarian response"],
    certifications: ["PMP", "Project Management Professional", "Monitoring & Evaluation Certification", "CHS Certification"],
    summaryTemplates: [
      "Development professional with X years of experience implementing community-based programs.",
      "Passionate about sustainable development with expertise in project management and M&E."
    ]
  },
  {
    industry: "Government & Public Administration",
    skills: ["Public Administration", "Policy Analysis", "Report Writing", "Budget Management", "Stakeholder Engagement", "Regulatory Compliance", "Public Speaking", "Leadership", "Strategic Planning", "Community Development", "Records Management", "Legislative Drafting", "Public Procurement", "Civil Service Reform", "Intergovernmental Relations", "Conflict Resolution"],
    keywords: ["public service", "policy implementation", "government relations", "public affairs", "civil service", "public sector governance", "municipal administration"],
    certifications: ["Public Administration Certificate", "Leadership Development Program", "Certified Public Manager"],
    summaryTemplates: [
      "Public administration professional with X years of experience in government service.",
      "Dedicated public servant with expertise in policy implementation and community engagement."
    ]
  },
  {
    industry: "Telecom",
    skills: ["Network Engineering", "TCP/IP", "Fiber Optics", "4G/5G Technologies", "Project Management", "Customer Service", "Sales", "Technical Support", "ERP Systems", "Data Analysis", "VoIP", "Network Security", "Troubleshooting", "Telecom Regulation", "Spectrum Management", "Mobile Money"],
    keywords: ["telecommunications", "network infrastructure", "mobile services", "broadband", "digital transformation", "connectivity", "telecom services"],
    certifications: ["Cisco CCNA", "Huawei HCIA", "Juniper JNCIA", "ITIL", "CWNP"],
    summaryTemplates: [
      "Telecommunications professional with X years of experience in network operations.",
      "Results-driven telecom engineer with expertise in network optimization and customer experience."
    ]
  },
  {
    industry: "Engineering",
    skills: ["AutoCAD", "Project Management", "Quality Control", "Safety Management", "Technical Drawing", "Structural Analysis", "Material Testing", "Site Supervision", "Budget Management", "Stakeholder Communication", "Surveying", "Environmental Impact Assessment", "Geotechnical Analysis", "Hydraulics", "Urban Planning", "Construction Management"],
    keywords: ["construction", "infrastructure", "quality assurance", "project delivery", "engineering design", "civil works", "building construction"],
    certifications: ["Professional Engineer (PE)", "PMP", "NEBOSH", "Six Sigma", "AutoCAD Certified"],
    summaryTemplates: [
      "Civil engineer with X years of experience in infrastructure development and project management.",
      "Results-oriented engineer with expertise in construction management and quality control."
    ]
  },
  {
    industry: "Healthcare",
    skills: ["Patient Care", "Medical Records", "Health Education", "Data Collection", "Laboratory Procedures", "Pharmacy Management", "Public Health", "Epidemiology", "Health Information Systems", "Community Health", "Infection Control", "Triage", "Vaccination Programs", "Nutrition Counseling", "Mental Health Support", "Health Policy"],
    keywords: ["healthcare delivery", "patient outcomes", "health programs", "disease prevention", "health promotion", "clinical services", "primary healthcare"],
    certifications: ["Medical License", "BLS Certification", "WHO Certifications", "Public Health Certification", "ICM Certification"],
    summaryTemplates: [
      "Healthcare professional with X years of experience in patient care and health program management.",
      "Dedicated health worker with expertise in community health and disease prevention programs."
    ]
  },
  {
    industry: "Education",
    skills: ["Curriculum Development", "Classroom Management", "Student Assessment", "Lesson Planning", "Educational Technology", "Research", "Academic Writing", "Mentoring", "Educational Leadership", "Inclusive Education", "Student Counseling", "Examination Preparation", "Special Needs Education", "Parent Engagement", "School Administration", "Grant Writing"],
    keywords: ["teaching", "learning outcomes", "educational development", "student success", "academic excellence", "pedagogy", "teacher training"],
    certifications: ["Teaching License", "TESOL/TEFL", "Educational Leadership Certificate", "Special Education Certification"],
    summaryTemplates: [
      "Educator with X years of experience in curriculum development and student engagement.",
      "Passionate teacher committed to innovative pedagogy and student success."
    ]
  },
  {
    industry: "Hospitality & Tourism",
    skills: ["Customer Service", "Food & Beverage Management", "Event Planning", "Hotel Operations", "Revenue Management", "Guest Relations", "Tourism Marketing", "Staff Training", "Inventory Management", "Quality Assurance", "Housekeeping Management", "Front Office Operations", "Concierge Services", "Tour Guide", "Cultural Heritage Preservation", "Sustainable Tourism"],
    keywords: ["guest satisfaction", "hospitality management", "tourism development", "service excellence", "revenue optimization", "hotel management", "tourism services"],
    certifications: ["Hotel Management Certificate", "Food Safety Certificate", "Tourism Certification", "ServSafe"],
    summaryTemplates: [
      "Hospitality professional with X years of experience in hotel operations and guest services.",
      "Results-driven hospitality manager with expertise in revenue optimization and team leadership."
    ]
  },
  {
    industry: "Marketing & Sales",
    skills: ["Digital Marketing", "Social Media Marketing", "Content Creation", "SEO/SEM", "Google Analytics", "CRM Systems", "Sales Strategy", "Market Research", "Brand Management", "Public Relations", "Email Marketing", "Copywriting", "Customer Relationship Management", "Sales Forecasting", "Retail Management", "Distribution Management"],
    keywords: ["brand awareness", "lead generation", "customer acquisition", "market share", "sales growth", "marketing campaigns", "consumer behavior"],
    certifications: ["Google Ads Certification", "HubSpot Inbound Marketing", "Facebook Blueprint", "Digital Marketing Institute"],
    summaryTemplates: [
      "Marketing professional with X years of experience in digital marketing and brand management.",
      "Results-driven marketer with expertise in lead generation and customer engagement."
    ]
  },
  {
    industry: "Agriculture & Food Security",
    skills: ["Crop Production", "Soil Analysis", "Irrigation Management", "Pest Management", "Agricultural Extension", "Food Processing", "Supply Chain Management", "Cooperative Management", "Agricultural Research", "Livestock Management", "Agribusiness", "Post-Harvest Handling", "Farm Equipment Operation", "Agricultural Economics", "Climate-Smart Agriculture", "Value Chain Analysis"],
    keywords: ["food security", "agricultural development", "rural livelihoods", "crop improvement", "sustainable agriculture", "farm management"],
    certifications: ["Agricultural Diploma", "Cooperative Manager Certificate", "Good Agricultural Practices"],
    summaryTemplates: [
      "Agricultural professional with X years of experience in crop production and farm management.",
      "Results-oriented agronomist with expertise in sustainable agriculture and food security programs."
    ]
  },
  {
    industry: "Legal & Justice",
    skills: ["Legal Research", "Case Management", "Contract Drafting", "Court Procedures", "Client Counseling", "Mediation", "Legal Writing", "Regulatory Compliance", "Intellectual Property", "Corporate Law", "Human Rights Law", "Criminal Law", "Civil Litigation", "Arbitration", "Legal Aid", "Legislative Analysis"],
    keywords: ["legal services", "justice", "rule of law", "legal compliance", "dispute resolution", "legal advocacy"],
    certifications: ["Bar Association License", "Legal Practice Certificate", "Mediation Certification"],
    summaryTemplates: [
      "Legal professional with X years of experience in litigation and corporate law.",
      "Dedicated attorney with expertise in legal research, client counseling, and regulatory compliance."
    ]
  },
  {
    industry: "Manufacturing & Industry",
    skills: ["Production Planning", "Quality Assurance", "Lean Manufacturing", "Supply Chain Management", "Inventory Control", "Safety Management", "Equipment Maintenance", "Process Improvement", "Six Sigma", "Warehouse Management", "Production Scheduling", "Cost Reduction", "ISO Standards", "Root Cause Analysis", "Workforce Management", "Industrial Engineering"],
    keywords: ["manufacturing operations", "production efficiency", "quality control", "supply chain", "industrial production", "process optimization"],
    certifications: ["Six Sigma Green Belt", "ISO 9001", "OSHA Certified", "PMP"],
    summaryTemplates: [
      "Manufacturing professional with X years of experience in production management and quality assurance.",
      "Results-driven operations manager with expertise in lean manufacturing and process optimization."
    ]
  },
  {
    industry: "Media & Communications",
    skills: ["Journalism", "Content Writing", "Video Production", "Photography", "Social Media Management", "Public Relations", "Event Management", "Graphic Design", "Radio Broadcasting", "Media Planning", "Copy Editing", "News Reporting", "Documentary Production", "Media Law", "Crisis Communication", "Brand Storytelling"],
    keywords: ["media production", "communications strategy", "content creation", "public relations", "media relations", "broadcasting"],
    certifications: ["Journalism Certificate", "PRSA Certification", "Google Analytics", "Adobe Certified"],
    summaryTemplates: [
      "Media professional with X years of experience in journalism and content creation.",
      "Creative communications specialist with expertise in public relations and media management."
    ]
  },
  {
    industry: "Real Estate & Construction",
    skills: ["Property Valuation", "Real Estate Marketing", "Lease Negotiation", "Property Management", "Construction Supervision", "Building Codes", "Site Planning", "Cost Estimation", "Contract Management", "Urban Development", "Land Surveying", "Architectural Design", "Interior Design", "Facility Management", "Zoning Regulations", "Sustainable Building"],
    keywords: ["real estate development", "property management", "construction projects", "building construction", "land development"],
    certifications: ["Real Estate License", "PMP", "LEED Certification", "Construction Manager"],
    summaryTemplates: [
      "Real estate professional with X years of experience in property management and development.",
      "Results-oriented construction manager with expertise in project delivery and quality assurance."
    ]
  },
  {
    industry: "Transport & Logistics",
    skills: ["Fleet Management", "Route Optimization", "Supply Chain Management", "Warehouse Operations", "Customs Clearance", "Freight Forwarding", "Inventory Management", "Transport Planning", "Safety Compliance", "Logistics Coordination", "Procurement", "Distribution Management", "Last-Mile Delivery", "Cold Chain Management", "Import/Export Regulations", "GPS Tracking"],
    keywords: ["logistics operations", "supply chain", "transport management", "freight services", "distribution", "warehousing"],
    certifications: ["CILT Certification", "Customs Broker License", " Dangerous Goods Certificate"],
    summaryTemplates: [
      "Logistics professional with X years of experience in supply chain and transport management.",
      "Results-driven logistics manager with expertise in fleet management and distribution optimization."
    ]
  }
];

export function getIndustrySuggestions(industry: string): IndustrySuggestion | undefined {
  return ethiopianIndustries.find(i => i.industry.toLowerCase() === industry.toLowerCase());
}

export function getIndustryByKeyword(keyword: string): IndustrySuggestion | undefined {
  return ethiopianIndustries.find(i => 
    i.industry.toLowerCase().includes(keyword.toLowerCase()) ||
    i.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
  );
}

export const ethiopianHolidays: string[] = [
  "Timkat (Ethiopian Epiphany)",
  "Meskel (Finding of the True Cross)",
  "Ethiopian New Year (Enkutatash)",
  "Fasika (Ethiopian Easter)",
  "Genna (Ethiopian Christmas)",
  "Irreecha",
  "Birth of Prophet Muhammad"
];

export function formatEthiopianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("251")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+251 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

export function getCountryCode(): string {
  return "+251";
}
