const express = require('express');
const router = express.Router();

const serviceTypes = [
  { id: 'st1', name: 'Oil Change', description: 'Full synthetic oil change with filter replacement', price: 79, duration: '1 hour' },
  { id: 'st2', name: 'Brake Inspection', description: 'Complete brake system inspection and diagnostics', price: 49, duration: '45 min' },
  { id: 'st3', name: 'Full Service', description: 'Comprehensive vehicle service and maintenance', price: 299, duration: '4 hours' },
  { id: 'st4', name: 'Tire Rotation', description: 'Rotate and balance all four tires', price: 59, duration: '30 min' },
  { id: 'st5', name: 'Engine Diagnostics', description: 'Full engine computer diagnostics scan', price: 99, duration: '1.5 hours' },
  { id: 'st6', name: 'AC Service', description: 'Air conditioning system check and recharge', price: 129, duration: '2 hours' },
];

router.get('/types', (req, res) => {
  res.json(serviceTypes);
});

module.exports = router;
