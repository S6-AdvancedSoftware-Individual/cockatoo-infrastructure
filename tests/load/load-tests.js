import http from 'k6/http';
import { check } from 'k6';
import { getAccessToken } from './auth.js';

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp-up to 10 users
    { duration: '3m', target: 50 }, // Hold at 50 users
    { duration: '1m', target: 10 }, // Ramp-down to 10 users
  ],
};

// Default function for load testing
export default function () {
  const accessToken = getAccessToken();
  const res = http.get('http://localhost:5000/api/posts', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  check(res, {
    'status is 200 or rate limit 429': (r) => r.status === 200 || r.status === 429,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
