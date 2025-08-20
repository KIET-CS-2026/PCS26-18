// Test script to verify meeting creation and data flow
// This file can be used to test the API endpoints manually

const API_BASE = 'http://localhost:8000/api';

// Test function to create a meeting
export const testCreateMeeting = async (accessToken) => {
  const meetingData = {
    title: 'Test Meeting',
    description: 'This is a test meeting to verify the data flow',
    type: 'web2',
    isPublic: true,
    isLocked: false,
    maxParticipants: 10,
    scheduledStartTime: new Date().toISOString(),
    scheduledEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    tags: ['test', 'demo']
  };

  try {
    const response = await fetch(`${API_BASE}/meetings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(meetingData)
    });

    const result = await response.json();
    console.log('Create meeting result:', result);
    return result;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

// Test function to get created meetings
export const testGetCreatedMeetings = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE}/meetings/created?page=1&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();
    console.log('Created meetings result:', result);
    return result;
  } catch (error) {
    console.error('Error getting created meetings:', error);
    throw error;
  }
};

// Test function to get public meetings
export const testGetPublicMeetings = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE}/meetings/public?page=1&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();
    console.log('Public meetings result:', result);
    return result;
  } catch (error) {
    console.error('Error getting public meetings:', error);
    throw error;
  }
};

// Full test sequence
export const runFullTest = async (accessToken) => {
  console.log('Starting full meeting test...');
  
  try {
    // 1. Create a meeting
    console.log('1. Creating a test meeting...');
    const createResult = await testCreateMeeting(accessToken);
    
    // 2. Wait a moment for the database to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Get created meetings
    console.log('2. Fetching created meetings...');
    const createdMeetings = await testGetCreatedMeetings(accessToken);
    
    // 4. Get public meetings
    console.log('3. Fetching public meetings...');
    const publicMeetings = await testGetPublicMeetings(accessToken);
    
    console.log('Full test completed successfully!');
    return {
      createResult,
      createdMeetings,
      publicMeetings
    };
  } catch (error) {
    console.error('Full test failed:', error);
    throw error;
  }
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  window.meetingTests = {
    testCreateMeeting,
    testGetCreatedMeetings,
    testGetPublicMeetings,
    runFullTest
  };
}
