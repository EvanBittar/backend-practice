const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

describe('POST /login', () => {
    test('rejects login with missing fields', async () => {
        const response = await request(app)
            .post('/login')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    test('rejects login with wrong password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ name: 'evanevo1', password: '12312312312' });

        expect(response.status).toBe(401);
    });
});
describe('POST /signup', () => {
    test('rejects sign up with missing fields', async () => {
        const response = await request(app)
            .post('/signup')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    test('rejects sign up with empty name', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ name: '', age: '100', password: 'evanevo1' });

        expect(response.status).toBe(400);
    });
    test('rejects sign up with wrong number for age between 1 and 120', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ name: 'evan', age: '123213', password: 'evanevo1' });

        expect(response.status).toBe(400);
    });

    test('rejects sign up with lenght password is 4', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ name: 'evan', age: '20', password: 'evan' });

        expect(response.status).toBe(400);
    });
    test('successful signup', async () => {
        const testname = `evan1200_${Date.now()}`;

        const response = await request(app)
            .post('/signup')
            .send({ name: testname, age: '29', password: 'evan1200' })

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(testname);
    });
});

describe('GET /users', () => {
    let token;

    beforeAll(async () => {
        const response = await request(app)
            .post('/login')
            .send({ name: 'evanevo1', password: 'evanevo1' });
        token = response.body.token;
    });
    test('rejects request with no token', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(401);
    });
    test('rejects request with invalid token', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer invalidtoken123');

        expect(response.status).toBe(403);
    });
    test('Acceptance request with valid token', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST/PUT/DELETE  /users', () => {
    let token;
    let createdUserId;

    beforeAll(async () => {
        const response = await request(app)
            .post('/login')
            .send({ name: 'evanevo1', password: 'evanevo1' });
        token = response.body.token;
    });

    test('rejects request with no token', async () => {
        const response = await request(app)
            .post('/users');
        expect(response.status).toBe(401);
    });
    test('rejects request with invaild token', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', 'Bearer invalidtoken123');

        expect(response.status).toBe(403);
    });
    test('rejects request with vaild token but with missing fields', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });
    test('rejects request with vaild token but with no name ', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: '', age: '120' });

        expect(response.status).toBe(400);
    });
    test('rejects request with vaild token but with wrong number for age between 1 and 120', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'new_post', age: '121' });

        expect(response.status).toBe(400);
    });
    test('Acceptance request with vaild token but with correct fields', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'test_crud_user', age: 120 });

        expect(response.status).toBe(201);
        createdUserId = response.body.id;
    });
    test('updates the created user', async () => {
        const response = await request(app)
            .put(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'updated_crud_user', age: 31 });

        expect(response.status).toBe(200);
    });
    test('deletes the created user', async () => {
        const response = await request(app)
            .delete(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

});


afterAll(async () => {
    await pool.query("DELETE FROM users WHERE `name` LIKE 'evan1200_%' OR `name` = 'new_post' OR `name` = 'updated_crud_user';");
    await pool.end();
});