import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 10 }, // Ramp up to 10 VUs over 10 seconds
        { duration: '20s', target: 50 }, // Ramp up to 50 VUs over the next 20 seconds
        { duration: '10s', target: 0 },  // Ramp down to 0 VUs over 10 seconds
      ],
    },
  },
};

// Default function for load testing
export default function () {
  const res = http.get('http://localhost:5000/api/posts');

  // Check if the response is valid
  if (res.status !== 200) {
    console.log(`Unexpected response status: ${res.status}`);
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 800ms': (r) => r.timings.duration < 800,
  });
}
