// Removed all TypeScript interfaces and type declarations

export const mockUsers = [
  { id: 'u1', name: 'Abdul Moiz', email: 'abdul@example.com', role: 'customer' },
  { id: 'u2', name: 'Mike Torres', email: 'mike@autocare.com', role: 'mechanic' },
  { id: 'u3', name: 'Sarah Mitchell', email: 'sarah@autocare.com', role: 'manager' },
];

export const mockVehicles = [
  { id: 'v1', customerId: 'u1', make: 'Changan', model: 'Alsvin', year: 2023, plate: 'ABC-1234', color: 'White', vin: '1HGBH41JXMN109186', mileage: 15500, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop' },
  { id: 'v2', customerId: 'u1', make: 'Honda', model: 'CR-V', year: 2021, plate: 'XYZ-5678', color: 'White', vin: '2HGBH41JXMN209186', mileage: 42000, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=600&h=400&fit=crop' },
  { id: 'v3', customerId: 'u1', make: 'BMW', model: '3 Series', year: 2023, plate: 'DEF-9012', color: 'Black', vin: '3HGBH41JXMN309186', mileage: 12000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop' },
];

export const serviceTypes = [
  { id: 'st1', name: 'Oil Change', description: 'Full synthetic oil change with filter replacement', price: 79, duration: '1 hour', icon: '💧' },
  { id: 'st2', name: 'Brake Inspection', description: 'Complete brake system inspection and diagnostics', price: 49, duration: '45 min', icon: '🛡️' },
  { id: 'st3', name: 'Full Service', description: 'Comprehensive vehicle service and maintenance', price: 299, duration: '4 hours', icon: '🔧' },
  { id: 'st4', name: 'Tire Rotation', description: 'Rotate and balance all four tires', price: 59, duration: '30 min', icon: '⚙️' },
  { id: 'st5', name: 'Engine Diagnostics', description: 'Full engine computer diagnostics scan', price: 99, duration: '1.5 hours', icon: '💻' },
  { id: 'st6', name: 'AC Service', description: 'Air conditioning system check and recharge', price: 129, duration: '2 hours', icon: '❄️' },
];

export const mockServices = [
  { id: 's1', vehicleId: 'v1', customerId: 'u1', mechanicId: 'u2', serviceType: 'Oil Change', status: 'in-progress', priority: 'medium', description: 'Regular oil change service', notes: ['Vehicle received', 'Old oil drained', 'New filter installed'], cost: 79, createdAt: '2026-03-28', updatedAt: '2026-03-30', estimatedCompletion: '2026-03-31' },
  { id: 's2', vehicleId: 'v2', customerId: 'u1', mechanicId: 'u2', serviceType: 'Brake Inspection', status: 'diagnosed', priority: 'high', description: 'Squeaking noise when braking', notes: ['Front brake pads worn'], cost: 149, createdAt: '2026-03-29', updatedAt: '2026-03-30', estimatedCompletion: '2026-04-01' },
  { id: 's3', vehicleId: 'v3', customerId: 'u1', serviceType: 'Full Service', status: 'pending', priority: 'low', description: 'Scheduled 15,000 mile service', notes: [], cost: 299, createdAt: '2026-03-30', updatedAt: '2026-03-30', estimatedCompletion: '2026-04-03' },
  { id: 's4', vehicleId: 'v1', customerId: 'u1', mechanicId: 'u2', serviceType: 'Tire Rotation', status: 'completed', priority: 'low', description: 'Rotate all tires', notes: ['All tires rotated', 'Pressure checked'], cost: 59, createdAt: '2026-03-15', updatedAt: '2026-03-15' },
  { id: 's5', vehicleId: 'v2', customerId: 'u1', mechanicId: 'u2', serviceType: 'Engine Diagnostics', status: 'completed', priority: 'medium', description: 'Check engine light on', notes: ['O2 sensor replaced', 'Code cleared'], cost: 199, createdAt: '2026-03-10', updatedAt: '2026-03-12' },
  { id: 's6', vehicleId: 'v3', customerId: 'u1', mechanicId: 'u2', serviceType: 'AC Service', status: 'completed', priority: 'medium', description: 'AC not cooling properly', notes: ['Refrigerant recharged', 'System tested'], cost: 129, createdAt: '2026-02-20', updatedAt: '2026-02-21' },
];

export const mockMechanics = [
  { id: 'u2', name: 'Mike Torres', email: 'mike@autocare.com', specialization: 'Engine & Transmission', activeJobs: 3, completedJobs: 156, rating: 4.8 },
  { id: 'm2', name: 'David Kim', email: 'david@autocare.com', specialization: 'Brakes & Suspension', activeJobs: 2, completedJobs: 132, rating: 4.7 },
  { id: 'm3', name: 'Carlos Rodriguez', email: 'carlos@autocare.com', specialization: 'Electrical Systems', activeJobs: 1, completedJobs: 98, rating: 4.9 },
  { id: 'm4', name: 'James Wilson', email: 'james@autocare.com', specialization: 'AC & Cooling', activeJobs: 2, completedJobs: 115, rating: 4.6 },
];

export const weeklyBookingsData = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 19 },
  { day: 'Wed', bookings: 15 },
  { day: 'Thu', bookings: 22 },
  { day: 'Fri', bookings: 28 },
  { day: 'Sat', bookings: 18 },
  { day: 'Sun', bookings: 8 },
];

export const servicesByTypeData = [
  { name: 'Oil Change', value: 35, fill: '#a78bfa' },
  { name: 'Brake Service', value: 20, fill: '#34d399' },
  { name: 'Full Service', value: 15, fill: '#fbbf24' },
  { name: 'Tire Service', value: 12, fill: '#8b5cf6' },
  { name: 'Diagnostics', value: 10, fill: '#f87171' },
  { name: 'Other', value: 8, fill: '#6b6783' },
];

export const revenueData = [
  { month: 'Oct', revenue: 18500 },
  { month: 'Nov', revenue: 22400 },
  { month: 'Dec', revenue: 19800 },
  { month: 'Jan', revenue: 24100 },
  { month: 'Feb', revenue: 26300 },
  { month: 'Mar', revenue: 28900 },
];