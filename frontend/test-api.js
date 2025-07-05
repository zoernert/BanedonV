// Test Collections API
const testApi = async () => {
  try {
    const response = await fetch('/api/v1/collections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Collections API Response:', data);
    return data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
};

// Call the test function
testApi();
