/*require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token;
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns favorites', async(done) => {

      const expectation = [
        {
          id: 1,
          category: 'Science: Computers',
          type: 'multiple',
          difficulty: 'easy',
          question: 'When Gmail first launched, how much storage did it provide for your email?',
          correct_answer: '1GB',
          incorrect_answers: '["512MB","5GB","Unlimited"]',
          user_id: 1,
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

      done();
    });

    test('returns a single favorite', async(done) => {

      const expectation = [
        {
          category: 'Geography',
          type: 'boolean',
          difficulty: 'medium',
          id: 2,
          question: 'The title of the 1969 film &quot;Krakatoa, East_of Java&quot; is incorrect, as Krakatoa is in fact west of Java.',
          correct_answer: 'True',
          incorrect_answers: [
            'False'
          ],
          user_id: 1
        },
      ];

      const data = await fakeRequest(app)
        .get('/api/favorites/2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

      done();
    });
  });
});*/
