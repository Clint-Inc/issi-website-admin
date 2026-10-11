import { Property } from '../types/property';
import { Client } from '../types/client';
import { Inquiry } from '../types/inquiry';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Magnificent 5-Bedroom Smart Villa',
    location: 'Lekki Phase 1, Lagos',
    area: 'Lekki',
    price: 380000000,
    beds: 5,
    baths: 6,
    type: 'Sale',
    description: 'An architectural masterpiece featuring automated home intelligence, infinity pool, elevator, private cinema, and lush greenery.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    image_labels: ['Exterior Facade', 'Master Living Suite', 'Gourmet Kitchen'],
    specs: ['5,200 sqft', '3 Car Garage', 'Smart Automation', 'Solar & Inverter System'],
    details: {
      'Year Built': '2024',
      'Title Document': 'Governor\'s Consent',
      'Security': '24/7 Gated Access & CCTV'
    },
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prop-2',
    title: 'Ultra-Luxury Waterfront Penthouse',
    location: 'Banana Island, Ikoyi',
    area: 'Ikoyi',
    price: 950000000,
    beds: 4,
    baths: 5,
    type: 'Sale',
    description: 'Panoramic views of the Lagos lagoon, private rooftop jacuzzi, Italian marble floors, and concierge service.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    image_labels: ['Lagoon Balcony View', 'Primary Suite'],
    specs: ['6,800 sqft', 'Private Boat Slip', 'High-Speed Private Lift'],
    details: {
      'Year Built': '2023',
      'Title Document': 'Federal C of O',
      'Service Charge': '₦4.5m / year'
    },
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prop-3',
    title: 'Modern Executive Duplex',
    location: 'Victoria Island, Lagos',
    area: 'Victoria Island',
    price: 35000000,
    beds: 3,
    baths: 4,
    type: 'Rent',
    description: 'Fully furnished executive townhouse situated in the diplomatic quarter with power backup and gym access.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    image_labels: ['Living Room'],
    specs: ['Fully Furnished', 'High-speed Fiber Optics', '24/7 Power'],
    details: {
      'Lease Duration': '1 Year Minimum',
      'Caution Fee': '10%'
    },
    featured: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    full_name: 'Dr. Okey Nduka',
    email: 'okey.nduka@example.com',
    phone: '+2348137855192',
    location: 'Lagos / UK Diaspora',
    interest: 'Buy',
    budget_naira: 400000000,
    preferred_area: 'Lekki Phase 1',
    source: 'Instagram',
    notes: 'Looking for a brand new 4 or 5 bed smart home for immediate purchase. Prefers Governor\'s Consent.',
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'client-2',
    full_name: 'Chief Amina Bello',
    email: 'amina.bello@example.com',
    phone: '+2348023456789',
    location: 'Abuja / Lagos',
    interest: 'Buy',
    budget_naira: 1000000000,
    preferred_area: 'Banana Island',
    source: 'Referral',
    notes: 'High-net-worth client interested in waterfront penthouses or ambassadorial mansions.',
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'client-3',
    full_name: 'Emeka Opara',
    email: 'emeka.opara@example.com',
    phone: '+2347098765432',
    location: 'Victoria Island',
    interest: 'Rent',
    budget_naira: 35000000,
    preferred_area: 'Victoria Island / Ikoyi',
    source: 'Website',
    notes: 'Corporate relocation lease for 2 years.',
    status: 'Converted',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Chidinma Eze',
    email: 'chidinma@example.com',
    phone: '+2348123456780',
    subject: 'Acquisition Enquiry: Lekki Smart Villa',
    message: 'Good day Hermanita team, I would like to schedule a private walkthrough of the 5-Bedroom Smart Villa in Lekki Phase 1 for this coming Saturday.',
    property_id: 'prop-1',
    inquiry_type: 'Property',
    status: 'New',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inq-2',
    name: 'Tunde Bakare',
    email: 'tunde.b@example.com',
    phone: '+2348033334444',
    subject: 'Real Estate Investment Portfolio Advisory',
    message: 'We represent a private syndicate looking to deploy capital into commercial and high-yield residential properties in Ikoyi.',
    inquiry_type: 'Advisory',
    status: 'In Progress',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inq-3',
    name: 'Sarah Jenkins',
    email: 's.jenkins@expats-lagos.org',
    phone: '+2348166667777',
    subject: 'Waterfront Penthouse Inspection',
    message: 'Interested in seeing floor plans and legal documentation for the Banana Island penthouse.',
    property_id: 'prop-2',
    inquiry_type: 'Property',
    status: 'Read',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString()
  }
];
