import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from './app.js';

test('GET /health returns gateway status', async () => {
  const response = await request(createApp()).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.service, 'api-gateway');
  assert.equal(response.body.status, 'ok');
});
