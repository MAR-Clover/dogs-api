
const request = require('supertest');
// express app
const app = require('./index');


// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');


describe('Endpoints', () => {
   // to be used in POST test
   const testDogData = {
       breed: 'Poodle',
       name: 'Sasha',
       color: 'black',
       description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
   };


   beforeAll(async () => {
       // rebuild db before the test suite runs
       await seed();
   });


   describe('GET /dogs', () => {
       it('should return list of dogs with correct data', async () => {
           // make a request
           const response = await request(app).get('/dogs');
           // assert a response code
           expect(response.status).toBe(200);
           // expect a response
           expect(response.body).toBeDefined();
           // toEqual checks deep equality in objects
           expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
       });
   });


   describe('POST /dogs', function() {
       it('responds with json matching what was sent', async () => {
         const res = await request(app).post("/dogs").send(testDogData);
    
         expect(res.status).toBe(200);
         expect(res.body).toEqual(expect.objectContaining(testDogData));
       });




       it('contains correct id of the testDogData that was sent', async () => {
           const res = await request(app).post("/dogs").send(testDogData);
        
           expect(res.status).toBe(200);
           expect(res.body.id).toBe(7);
         });




     });


     it('deletes the dog with ID 1', async () => {
       await request(app).delete('/dogs/1');
    
       const dogs = await Dog.findAll({ where: { id: 1 } });
    
       expect(dogs).toEqual([]);
     });




});
