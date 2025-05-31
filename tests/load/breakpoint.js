import http from 'k6/http';
import { check, sleep, fail } from 'k6';

// Test configuration
export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 600,
      stages: [
        { duration: '10m', target: 600 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

// Default function for load testing
export default function () {
  const res = http.get('http://localhost:5000/api/posts');

  if( res.status !== 200 && res.timings.duration > 1000) {
    console.log("Failed request: " + res.status + " - " + res.timings.duration + "ms");
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 800ms': (r) => r.timings.duration < 1000,
  });
}
