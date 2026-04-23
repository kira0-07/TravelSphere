require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// Data from mockData.js
const destinationsData = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=85',
    description: 'Iconic whitewashed cubic architecture clinging to volcanic cliffs above the deep blue Aegean Sea. Famous for spectacular sunsets, wine, and romance.',
    tags: ['Island', 'Romance', 'Beach', 'Sunset'],
    climate: 'Mediterranean',
    bestMonths: ['May', 'Jun', 'Sep', 'Oct'],
    rating: 4.9,
    reviewCount: 2847,
    highlights: ['Oia Sunset', 'Caldera Views', 'Wine Tasting', 'Boat Tours'],
    featured: true,
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85',
    description: 'The Island of Gods — lush rice terraces, ancient Hindu temples, vibrant arts scene, and world-class surf breaks combine for an unforgettable experience.',
    tags: ['Cultural', 'Beach', 'Spiritual', 'Surf'],
    climate: 'Tropical',
    bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    rating: 4.8,
    reviewCount: 3521,
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Kuta Beach', 'Sacred Monkey Forest'],
    featured: true,
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    country: 'Peru',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=85',
    description: 'The legendary "Lost City of the Incas" — an ancient citadel set high in the Andes Mountains, shrouded in mystery and mist.',
    tags: ['UNESCO', 'Adventure', 'History', 'Mountain'],
    climate: 'Highland',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    rating: 4.9,
    reviewCount: 1893,
    highlights: ['Sun Gate', 'Huayna Picchu', 'Inca Trail', 'Sacred Valley'],
    featured: true,
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=85',
    description: 'Japan\'s ancient imperial capital — a mesmerizing blend of thousands of classical Buddhist temples, Shinto shrines, and imperial palaces.',
    tags: ['Cultural', 'UNESCO', 'Temple', 'History'],
    climate: 'Temperate',
    bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    rating: 4.9,
    reviewCount: 4102,
    highlights: ['Fushimi Inari', 'Arashiyama Bamboo', 'Gion District', 'Nishiki Market'],
    featured: false,
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&q=85',
    description: 'A tropical paradise of 1,192 coral islands — crystal-clear turquoise lagoons, overwater bungalows, and the most pristine reefs on Earth.',
    tags: ['Luxury', 'Beach', 'Diving', 'Romance'],
    climate: 'Tropical',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    rating: 4.8,
    reviewCount: 1654,
    highlights: ['Overwater Villas', 'Coral Reefs', 'Bioluminescent Beach', 'Whale Sharks'],
    featured: true,
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Chile / Argentina',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85',
    description: 'The end of the Earth — where the Andes Mountains meet the Southern Ocean in a dramatic landscape of glaciers, fjords, and windswept steppe.',
    tags: ['Adventure', 'Hiking', 'Wilderness', 'Glacier'],
    climate: 'Subpolar',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    rating: 4.7,
    reviewCount: 892,
    highlights: ['Torres del Paine', 'Perito Moreno Glacier', 'W Trek', 'Punta Arenas'],
    featured: false,
  },
  {
    id: 'sahara',
    name: 'Sahara Desert',
    country: 'Morocco',
    region: 'Africa',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&q=85',
    description: 'The world\'s largest hot desert — endless golden sand dunes, camel treks at sunrise, and nights under the most spectacular star-filled skies.',
    tags: ['Desert', 'Adventure', 'Camping', 'Stars'],
    climate: 'Arid Desert',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Feb', 'Mar'],
    rating: 4.7,
    reviewCount: 743,
    highlights: ['Erg Chebbi Dunes', 'Camel Trek', 'Desert Camping', 'Merzouga Village'],
    featured: false,
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1571054105989-f5bb9a7dbcd5?w=1600&q=85',
    description: 'Italy\'s most scenic coastline — dramatic cliffside villages tumbling into the glittering Tyrrhenian Sea, with mouth-watering cuisine and limoncello.',
    tags: ['Scenic', 'Culture', 'Food', 'Beach'],
    climate: 'Mediterranean',
    bestMonths: ['May', 'Jun', 'Sep', 'Oct'],
    rating: 4.8,
    reviewCount: 2156,
    highlights: ['Positano', 'Ravello', 'Path of the Gods', 'Ceramics Shopping'],
    featured: false,
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1589196728576-fea50085e040?w=1600&q=85',
    description: 'The "Adventure Capital of the World" — bungee jumping, skydiving, and jet boating set against the breathtaking backdrop of the Southern Alps.',
    tags: ['Adventure', 'Mountain', 'Extreme Sports', 'Scenic'],
    climate: 'Temperate',
    bestMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Jun', 'Jul', 'Aug'],
    rating: 4.8,
    reviewCount: 1342,
    highlights: ['Bungee Jumping', 'Milford Sound', 'Remarkables Ski', 'Lake Wakatipu'],
    featured: false,
  },
];

const packagesData = [
  {
    id: 'pkg-001',
    title: 'Greek Island Hopping',
    destinationId: 'santorini',
    destination: 'Santorini & Mykonos, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    duration: 10,
    groupSize: { min: 2, max: 12 },
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 342,
    badge: 'Best Seller',
    tags: ['Islands', 'Romance', 'Beach', 'Culture'],
    includes: ['Flights', 'Hotels', 'Breakfast', 'Island Transfers', 'City Tour', 'Wine Tasting'],
    excludes: ['Visa', 'Travel Insurance', 'Dinner', 'Personal Expenses'],
    difficulty: 'Easy',
    itinerary: [
      { day: 1, title: 'Arrival in Athens', activities: ['Airport pickup', 'Acropolis Museum visit', 'Welcome dinner'], accommodation: 'Athens Grand Hyatt' },
      { day: 2, title: 'Athens to Santorini', activities: ['Ferry to Santorini', 'Oia village exploration', 'Caldera sunset viewing'], accommodation: 'Canaves Oia Suites' },
      { day: 3, title: 'Santorini Discovery', activities: ['Akrotiri excavations', 'Perissa Black Beach', 'Local wine tasting'], accommodation: 'Canaves Oia Suites' },
      { day: 4, title: 'Island Exploration', activities: ['Fira town stroll', 'Cable car ride', 'Volcano boat tour'], accommodation: 'Canaves Oia Suites' },
      { day: 5, title: 'Santorini to Mykonos', activities: ['Ferry to Mykonos', 'Little Venice', 'Windmills photo stop'], accommodation: 'Mykonos Blu' },
    ],
    featured: true,
  },
  {
    id: 'pkg-002',
    title: 'Bali Spiritual Retreat',
    destinationId: 'bali',
    destination: 'Ubud & Seminyak, Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    duration: 8,
    groupSize: { min: 1, max: 8 },
    price: 1799,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 518,
    badge: 'Trending',
    tags: ['Spiritual', 'Yoga', 'Culture', 'Beach'],
    includes: ['Flights', 'Villa', 'Daily Breakfast', 'Yoga Classes', 'Temple Tours', 'Airport Transfer'],
    excludes: ['Visa on Arrival', 'Lunch & Dinner', 'Travel Insurance'],
    difficulty: 'Easy',
    itinerary: [
      { day: 1, title: 'Arrival in Bali', activities: ['Airport pickup', 'Hotel check-in', 'Welcome ceremony'], accommodation: 'Alaya Resort Ubud' },
      { day: 2, title: 'Ubud Temples', activities: ['Tirta Empul water temple', 'Sacred Monkey Forest', 'Traditional Kecak dance'], accommodation: 'Alaya Resort Ubud' },
      { day: 3, title: 'Rice Terraces', activities: ['Tegalalang Rice Terrace trek', 'Coffee plantation visit', 'Cooking class'], accommodation: 'Alaya Resort Ubud' },
    ],
    featured: true,
  },
  {
    id: 'pkg-003',
    title: 'Inca Trail Adventure',
    destinationId: 'machu-picchu',
    destination: 'Cusco & Machu Picchu, Peru',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
    duration: 9,
    groupSize: { min: 4, max: 16 },
    price: 2999,
    originalPrice: 3499,
    rating: 4.9,
    reviewCount: 267,
    badge: 'Adventure',
    tags: ['Hiking', 'Adventure', 'UNESCO', 'History'],
    includes: ['Flights', 'Hotels', 'All Meals on Trek', 'Inca Trail Permits', 'Expert Guide', 'Porter Service'],
    excludes: ['Travel Insurance', 'Personal Gear', 'Tips'],
    difficulty: 'Challenging',
    itinerary: [
      { day: 1, title: 'Arrival in Cusco', activities: ['Airport pickup', 'Altitude acclimatization', 'City orientation walk'], accommodation: 'Palacio Nazarenas' },
      { day: 2, title: 'Sacred Valley', activities: ['Pisac ruins', 'Ollantaytambo fortress', 'Traditional market'], accommodation: 'Sacred Valley Lodge' },
    ],
    featured: true,
  },
  {
    id: 'pkg-004',
    title: 'Japan Sakura Season',
    destinationId: 'kyoto',
    destination: 'Tokyo, Kyoto & Osaka',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    duration: 12,
    groupSize: { min: 2, max: 10 },
    price: 3799,
    originalPrice: 4499,
    rating: 4.9,
    reviewCount: 421,
    badge: 'Seasonal',
    tags: ['Culture', 'Cherry Blossoms', 'Temples', 'Food'],
    includes: ['Flights', '4-Star Hotels', 'JR Pass', 'Daily Breakfast', 'Tea Ceremony', 'City Tours'],
    excludes: ['Visa', 'Lunch & Dinner', 'Travel Insurance'],
    difficulty: 'Easy',
    itinerary: [],
    featured: false,
  },
  {
    id: 'pkg-005',
    title: 'Maldives Honeymoon',
    destinationId: 'maldives',
    destination: 'North Malé Atoll, Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    duration: 7,
    groupSize: { min: 2, max: 2 },
    price: 4999,
    originalPrice: 5999,
    rating: 5.0,
    reviewCount: 198,
    badge: 'Luxury',
    tags: ['Luxury', 'Romance', 'Beach', 'Diving'],
    includes: ['Flights', 'Overwater Villa', 'All-Inclusive', 'Speedboat Transfer', 'Snorkeling', 'Sunset Cruise'],
    excludes: ['Scuba Diving', 'Spa Treatments', 'Personal Expenses'],
    difficulty: 'Easy',
    itinerary: [],
    featured: false,
  },
  {
    id: 'pkg-006',
    title: 'Sahara Desert Expedition',
    destinationId: 'sahara',
    destination: 'Merzouga, Morocco',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    duration: 5,
    groupSize: { min: 4, max: 12 },
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 156,
    badge: 'Popular',
    tags: ['Desert', 'Adventure', 'Camping', 'Stars'],
    includes: ['Transfers', 'Camel Trek', 'Desert Camp', 'Breakfast & Dinner', 'Local Guide'],
    excludes: ['Flights', 'Lunch', 'Tips'],
    difficulty: 'Moderate',
    itinerary: [],
    featured: true,
  },
  {
    id: 'pkg-007',
    title: 'Amalfi Coast Roadtrip',
    destinationId: 'amalfi-coast',
    destination: 'Positano & Amalfi, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    duration: 8,
    groupSize: { min: 2, max: 8 },
    price: 3499,
    originalPrice: 3899,
    rating: 4.9,
    reviewCount: 412,
    tags: ['Scenic', 'Culture', 'Food', 'Beach'],
    includes: ['Hotels', 'Car Rental', 'Boat Tour', 'Breakfast', 'Wine Tasting'],
    excludes: ['Flights', 'Gas', 'Dinner'],
    difficulty: 'Easy',
    itinerary: [],
    featured: false,
  },
  {
    id: 'pkg-008',
    title: 'Queenstown Thrill Seeker',
    destinationId: 'queenstown',
    destination: 'Queenstown, New Zealand',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80',
    duration: 7,
    groupSize: { min: 1, max: 10 },
    price: 2199,
    originalPrice: 2599,
    rating: 4.8,
    reviewCount: 289,
    badge: 'Extreme',
    tags: ['Adventure', 'Mountain', 'Extreme Sports'],
    includes: ['Hotels', 'Bungee Jump pass', 'Skydiving', 'Jet Boat Ride'],
    excludes: ['Flights', 'Meals', 'Extra Activities'],
    difficulty: 'Challenging',
    itinerary: [],
    featured: true,
  },
  {
    id: 'pkg-009',
    title: 'Patagonia Glacier Trek',
    destinationId: 'patagonia',
    destination: 'Torres del Paine, Chile',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    duration: 10,
    groupSize: { min: 4, max: 14 },
    price: 4299,
    originalPrice: 4899,
    rating: 4.9,
    reviewCount: 175,
    badge: 'Epic',
    tags: ['Adventure', 'Hiking', 'Wilderness', 'Glacier'],
    includes: ['National Park Entry', 'Refugio stays', 'All Meals', 'Expert Guide'],
    excludes: ['Flights', 'Personal trekking gear'],
    difficulty: 'Hard',
    itinerary: [],
    featured: false,
  },
];

const hotelsData = [
  {
    id: 'htl-001',
    name: 'Canaves Oia Suites',
    destinationId: 'santorini',
    destination: 'Oia, Santorini',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    stars: 5,
    rating: 4.9,
    reviewCount: 1243,
    pricePerNight: 420,
    amenities: ['Pool', 'WiFi', 'Spa', 'Restaurant', 'Caldera View', 'Room Service'],
    type: 'Boutique Hotel',
    featured: true,
  },
  {
    id: 'htl-002',
    name: 'Alaya Resort Ubud',
    destinationId: 'bali',
    destination: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    stars: 5,
    rating: 4.8,
    reviewCount: 876,
    pricePerNight: 285,
    amenities: ['Infinity Pool', 'WiFi', 'Yoga Studio', 'Restaurant', 'Rice Field View', 'Spa'],
    type: 'Resort',
    featured: true,
  },
  {
    id: 'htl-003',
    name: 'Palacio Nazarenas',
    destinationId: 'machu-picchu',
    destination: 'Cusco, Peru',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    stars: 5,
    rating: 4.7,
    reviewCount: 542,
    pricePerNight: 380,
    amenities: ['Heated Pool', 'WiFi', 'Spa', 'Restaurant', 'Historic Palace', 'Concierge'],
    type: 'Luxury Hotel',
    featured: true,
  },
  {
    id: 'htl-004',
    name: 'Aman Tokyo',
    destinationId: 'kyoto',
    destination: 'Otemachi, Tokyo',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    stars: 5,
    rating: 4.9,
    reviewCount: 889,
    pricePerNight: 1200,
    amenities: ['Spa', 'WiFi', 'Restaurant', 'City Views', 'Fitness Center', 'Concierge'],
    type: 'Ultra-Luxury',
    featured: false,
  },
  {
    id: 'htl-005',
    name: 'Gili Lankanfushi',
    destinationId: 'maldives',
    destination: 'North Malé Atoll, Maldives',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    stars: 5,
    rating: 4.9,
    reviewCount: 654,
    pricePerNight: 1800,
    amenities: ['Private Pool', 'PADI Dive Center', 'WiFi', 'Overwater Villa', 'Butler', 'All-Inclusive'],
    type: 'Overwater Villas',
    featured: false,
  },
];

// Seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travelsphere';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear all collections
    await User.deleteMany();
    await Destination.deleteMany();
    await Package.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared all collections...');

    // Create primary admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@travelsphere.com',
      password: adminPassword,
      phone: '+1 555 000 0000',
      role: 'admin',
      avatar: ''
    });
    console.log('Created admin user:', admin.email);

    // Create test user 1
    const userPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: userPassword,
      phone: '+1 555 123 4567',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
    });
    console.log('Created test user 1:', user.email);

    // Create test user 2
    const user2 = await User.create({
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      password: userPassword,
      phone: '+1 555 987 6543',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
    });
    console.log('Created test user 2:', user2.email);

    // Seed destinations
    await Destination.insertMany(destinationsData);
    console.log(`Created ${destinationsData.length} destinations`);

    // Seed packages - all belong to admin
    const packagesWithAdmin = packagesData.map(pkg => ({
      ...pkg,
      createdBy: admin._id
    }));
    await Package.insertMany(packagesWithAdmin);
    console.log(`Created ${packagesWithAdmin.length} packages`);

    // Seed hotels
    await Hotel.insertMany(hotelsData);
    console.log(`Created ${hotelsData.length} hotels`);

    // Create sample bookings
    const bookingsData = [
      {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        packageId: 'pkg-001',
        packageTitle: 'Greek Island Hopping',
        destination: 'Santorini & Mykonos, Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-09-25'),
        travelers: 2,
        totalAmount: 4998,
        status: 'confirmed',
      },
      {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        packageId: 'pkg-003',
        packageTitle: 'Inca Trail Adventure',
        destination: 'Cusco & Machu Picchu, Peru',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&q=80',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-09'),
        travelers: 1,
        totalAmount: 2999,
        status: 'pending',
      },
      {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        packageId: 'pkg-002',
        packageTitle: 'Bali Spiritual Retreat',
        destination: 'Ubud & Seminyak, Bali',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        startDate: new Date('2023-11-10'),
        endDate: new Date('2023-11-20'),
        travelers: 2,
        totalAmount: 3598,
        status: 'completed',
      },
      {
        userId: user2._id,
        userName: user2.name,
        userEmail: user2.email,
        packageId: 'pkg-004',
        packageTitle: 'Japan Sakura Season',
        destination: 'Tokyo, Kyoto & Osaka',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-17'),
        travelers: 2,
        totalAmount: 7598,
        status: 'confirmed',
      },
    ];

    for (const booking of bookingsData) {
      await Booking.create(booking);
    }
    console.log(`Created ${bookingsData.length} bookings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('  Admin:  admin@travelsphere.com / admin123');
    console.log('  User 1: alex@example.com / password123');
    console.log('  User 2: sarah@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
