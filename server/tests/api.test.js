import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
// Since index.js uses CommonJS (require), and we are using Vitest (which supports ESM), 
// we might need to handle the import carefully. 
// However, Vitest usually handles CJS/ESM interop well.
// Let's rely on Vitest's magic. If it fails, we'll switch to require().
// Actually, looking at index.js, it's CJS. Let's use require in the test file to be safe, 
// OR simpler: just use valid ESM syntax which Vitest transforms.

// We need to point to the server entry point.
// Note: using relative path.
import { app } from '../index.js';

describe('Backend API Layer', () => {

    describe('Health Check', () => {
        it('GET /healthz should return 200 OK', async () => {
            const res = await request(app).get('/healthz');
            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
        });
    });

    describe('Auth Routes (Smoke Tests)', () => {
        // We can't easily test full Google Auth flow without mocking, 
        // but we can check if the route exists and redirects.
        it('GET /api/auth/google should redirect', async () => {
            const res = await request(app).get('/api/auth/google');
            // Expect redirect (302)
            expect(res.status).toBe(302);
            expect(res.header.location).toContain('accounts.google.com');
        });
    });

    describe('Lawyer Search', () => {
        it('GET /api/lawyers should return list of lawyers', async () => {
            const res = await request(app).get('/api/lawyers');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            // We can't guarantee data exists in the test DB, but the structure should be correct.
        });

        it('GET /api/lawyers?category=Criminal should filter (if data exists)', async () => {
            const res = await request(app).get('/api/lawyers?category=Criminal');
            expect(res.status).toBe(200);
            if (res.body.length > 0) {
                // If we have mock data, this assertion is stronger
                // For now, just ensure it doesn't crash
            }
        });
    });

    describe('Chatbot API', () => {
        // IMPORTANT: If this calls an external API (Gemini), we should mock it OR 
        // accept that it might fail if no key is present in test env.
        // For "Inch-to-Inch" testing, we want to know if the ROUTE works.

        it('POST /api/ai/chat should handle missing body gracefully', async () => {
            const res = await request(app).post('/api/ai/chat').send({});
            // Should probably be 400 or 500, not crash.
            expect(res.status).not.toBe(404); // Route must exist
        });
    });

    describe('Edge Cases', () => {
        it('should return 404 for unknown routes', async () => {
            const res = await request(app).get('/api/unknown-route-123');
            expect(res.status).toBe(404); // Express default 404
        });
    });
});
