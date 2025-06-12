/**
 * Debug script to analyze the my-events API response
 * This will help identify why upcoming events are showing as empty
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

async function debugMyEventsAPI() {
  console.log('🔍 Starting My Events Debug Analysis');
  console.log('📍 API Base URL:', API_BASE_URL);
  
  // Try to get credentials from sessionStorage/localStorage
  let email, password;
  
  if (typeof window !== 'undefined') {
    email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
  }
  
  if (!email || !password) {
    console.log('❌ No authentication credentials found');
    console.log('Please ensure you are logged in before running this debug script');
    return;
  }
  
  console.log('🔑 Found credentials for:', email);
  
  const authHeader = 'Basic ' + btoa(`${email}:${password}`);
  
  try {
    console.log('📞 Making API call to /events/my-events');
    
    const response = await fetch(`${API_BASE_URL}/events/my-events`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('📦 Raw API Response:', data);
    
    // Analyze the response structure
    console.log('\n🔬 Response Analysis:');
    console.log('- Type:', typeof data);
    console.log('- Is Array:', Array.isArray(data));
    
    if (data && typeof data === 'object') {
      console.log('- Keys:', Object.keys(data));
      
      // Check if it has the expected structure
      if (data.upcomingEvents || data.pastEvents) {
        console.log('✅ Response has upcomingEvents/pastEvents structure');
        console.log('- Upcoming Events:', data.upcomingEvents?.length || 0);
        console.log('- Past Events:', data.pastEvents?.length || 0);
        
        if (data.upcomingEvents?.length > 0) {
          console.log('📋 Sample Upcoming Event:', data.upcomingEvents[0]);
        }
      } else if (Array.isArray(data)) {
        console.log('📊 Response is an array with', data.length, 'events');
        
        if (data.length > 0) {
          console.log('📋 Sample Event:', data[0]);
          
          // Analyze event dates
          const now = new Date();
          const upcomingCount = data.filter(event => {
            const eventDate = new Date(event.startDate || event.date);
            return eventDate > now;
          }).length;
          
          const pastCount = data.length - upcomingCount;
          
          console.log('📅 Date Analysis:');
          console.log('- Current Date:', now.toISOString());
          console.log('- Upcoming Events (calculated):', upcomingCount);
          console.log('- Past Events (calculated):', pastCount);
          
          // Show event dates
          data.forEach((event, index) => {
            const eventDate = new Date(event.startDate || event.date);
            const isUpcoming = eventDate > now;
            console.log(`  Event ${index + 1}: ${event.title} - ${eventDate.toISOString()} (${isUpcoming ? 'Upcoming' : 'Past'})`);
          });
        }
      } else {
        console.log('❓ Unknown response structure');
      }
    }
    
  } catch (error) {
    console.error('❌ API Request Failed:', error);
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.debugMyEventsAPI = debugMyEventsAPI;
  console.log('🛠️ Debug function available as window.debugMyEventsAPI()');
}

export default debugMyEventsAPI;