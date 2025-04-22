import http from 'k6/http';
import { check, fail } from 'k6';

// Load environment variables
const clientId = __ENV.CLIENT_ID;
const clientSecret = __ENV.CLIENT_SECRET;
const audience = __ENV.AUDIENCE;
const authUrl = __ENV.AUTH_URL;

// Test configuration
export const options = {
  vus: 100,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.05'], // 5% max failure rate
    http_req_duration: ['p(95)<500'] // 95th percentile <500ms
  }
};

// Setup function to fetch access token
export function setup() {
  const authPayload = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    grant_type: 'client_credentials',
  });

  const authHeaders = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = http.post(authUrl, authPayload, authHeaders);

  if (response.status !== 200) {
    return "";
  }

  const accessToken = response.json().access_token;
  return { accessToken };
}

// Default function for load testing
export default function ({ accessToken }) {
  const apiHeaders = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const res = http.get('http://localhost:5000/api/posts', apiHeaders);
  
  check(res, {
    'status is 200 or rate limit 419': (r) => r.status === 200 || r.status === 429,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}