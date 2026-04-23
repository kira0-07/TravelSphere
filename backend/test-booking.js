// Using built-in fetch
async function testBooking() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));
    
    const token = loginData.token;
    console.log('Login successful');

    // 2. Book tour
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 10);

    const bookingRes = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        packageId: 'pkg-001',
        packageTitle: 'Greek Island Hopping',
        destination: 'Santorini & Mykonos, Greece',
        image: 'https://images.unsplash.com/photo-1234',
        startDate,
        endDate,
        travelers: 1,
        totalAmount: 2499
      })
    });

    const bookingData = await bookingRes.json();
    if (!bookingRes.ok) throw new Error('Booking failed: ' + JSON.stringify(bookingData));
    
    console.log('Booking successful:', bookingData);
  } catch (err) {
    console.error('Error occurred:', err.message);
  }
}

testBooking();
