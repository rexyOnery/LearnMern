import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from './app.js';

test('GET /health returns auth-service status', async () => {
  const response = await request(createApp()).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.service, 'auth-service');
  assert.equal(response.body.status, 'ok');
});
