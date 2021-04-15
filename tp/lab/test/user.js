const app = require('../app');
const db = require('../db_config');
const supertest = require('supertest');

describe('user api tests', () => {
	beforeEach(async () => {
		await db.clear(); //on va clean la base de données
	});

	it('list empty', async () => {
		// Return an empty user list by default
		const {body: users} = await supertest(app)
			.get('/api/v1/users')
			.expect(200)
            users.should.eql([])
	});

	it('list one element', async () => {
        // Create a user
        const user = {
          id: '123',
          name: 'user 1',
          email: 'email 1', 
          password: 'password 1'
        };
        await db.put(`users:${user.id}`, JSON.stringify(user));
        const {body: users} = await supertest(app)
        .get('/api/v1/users')
        .expect(200)
        users.should.match([{
          id: '123',
          name: 'user 1',
          email: 'email 1', 
          password: 'password 1'
        }]);
        
	});

	it('create new user name, email and password not given', async () => {
		await supertest(app)
			.post('/api/v1/users')
			.expect(400, {
        name: 'Name is required.',
        email: 'Email is required.',
        password: 'Password is required.'

    });
	});

	it('create new user', async () => {
		const {body} = await supertest(app)
        .post('/api/v1/users')
        .send({
          name: 'user 1',
          email: 'email 1',
          password: 'password 1'
         })
        .expect(201);
        
        body.should.match({
          id: /^\w+-\w+-\w+-\w+-\w+$/, //on utilise une regex pour dire que notre id correspond bien à un uui
          name: 'user 1',
          email: 'email 1',
          password: 'password 1'
	    	});
	});

	it('show user', async () => {
		// Create a user
		const user = {
			id: '123',
      name: 'user 1',
      email: 'email 1',
      password: 'password 1'
		};
		await db.put(`users:${user.id}`, JSON.stringify(user));

		// Ensure we list the users correctly
		await supertest(app)
			.get(`/api/v1/users/123`)
			.expect(200, {
				id: '123',
        name: 'user 1',
        email: 'email 1',
        password: 'password 1'
			});
	});

	//TODO show user with id who does not exist
    it(' show user with id who does not exist',async()=>{
        return new Promise( (resolve, reject) => {
            const users = []
            db.createReadStream({
              gt: "users:",
              lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
            }).on( 'data', ({key, value}) => {
              user = JSON.parse(value)
              user.id = key.split(':')[1]
              users.push(user)
            }).on( 'error', (err) => {
              reject(err)
            }).on( 'end', () => {
              resolve(users)
            })
          })
    });

  

     it('update user with all cases',async() => {
       // Create a user
       const user = {
        id: '123',
        name: 'user 1',
      };		
      const res = await supertest(app)
      .put(`/api/v1/users/${user.id}`)
      .send({
        name: 'update test name',
        email: 'update test email ',
        password: ' update test password '
      })
      console.log('Update a user!')
		
		});
  

    
    //TODO delete user with all cases
    it('delete user with all cases',async() => {
		// Create a user
    const {body: user1} = await supertest(app)
    .post('/api/v1/users')
    .send({name: 'user 1', email: 'email 1', password: 'password 1'})
    // Check it was correctly inserted
    const {body: user} = await supertest(app)
    .delete(`/api/v1/users/${user1.id}`)
    .expect(200)
    });
});