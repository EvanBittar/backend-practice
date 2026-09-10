const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

describe('POST /login',() => {
    test('rejects login with missing fields' , async () => {
        const response= await request(app)
        .post('/login')
        .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    test('rejects login with wrong password', async () => {
        const response = await request(app)
        .post('/login')
        .send({name:'evanevo1' , password:'12312312312'});

        expect(response.status).toBe(401);
    });
});
describe('POST /signup',() => {
    test('rejects sign up with missing fields' , async () => {
        const response= await request(app)
        .post('/signup')
        .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    test('rejects sign up with empty name', async () => {
        const response = await request(app)
        .post('/signup')
        .send({name:'' , age:'100' ,password:'evanevo1'});

        expect(response.status).toBe(400);
    });
    test('rejects sign up with wrong number for age between 1 and 120', async () => {
        const response = await request(app)
        .post('/signup')
        .send({name:'evan' , age:'123213' ,password:'evanevo1'});

        expect(response.status).toBe(400);
    });
    
    test('rejects sign up with lenght password is 4', async () => {
        const response = await request(app)
        .post('/signup')
        .send({name:'evan' , age:'20' ,password:'evan'});

        expect(response.status).toBe(400);
    });
    test('successful signup' ,  async () => {
        const testname = `evan1200_${Date.now()}`;

        const response = await request(app)
        .post('/signup')
        .send({name:testname , age:'29' ,password:'evan1200'})

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(testname);
    });
});
afterAll(async () => {
  await pool.end();
});