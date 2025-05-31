import http from 'k6/http';
import { check } from 'k6';

// Test configuration
export const options = {
  scenarios: {
    open_model: {
      executor: 'constant-arrival-rate',
      rate: 9,
      timeUnit: '5s',
      duration: '10s',
      preAllocatedVUs: 1,
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