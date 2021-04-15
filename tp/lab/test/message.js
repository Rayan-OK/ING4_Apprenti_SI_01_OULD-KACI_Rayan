const app = require('../app');
const db = require('../db_config');
const supertest = require('supertest');
const microtime = require('microtime');

describe('message api tests', () => {
	beforeEach(async () => {
		await db.clear(); //on va clean la base de données
	});

	it('list empty', async () => {
		// Create a channel
		const {body: channel} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
		// Get messages
		const {body: messages} = await supertest(app)
			.get(`/api/v1/channels/${channel.id}/messages`)
			.expect(200)
		messages.should.eql([])
			
	});

	it('list one message', async () => {
		// Create a channel
		const {body: channel} = await supertest(app)
		.post('/api/v1/channels/')
		.send({name: 'channel 1'})
		// and a message inside it
		await supertest(app)
		.post(`/api/v1/channels/${channel.id}/messages`)
		.send({
			author: 'diana',
			 content: 'test'
			})
		// Get messages
		const {body: messages} = await supertest(app)
		.get(`/api/v1/channels/${channel.id}/messages`)
		.expect(200)
		messages.should.eql([])
		
	  })


	it('create new message', async () => {		
		// Create a channel
		const {body: channel} = await supertest(app)
			.post(`/api/v1/channels`)
			.send({name: 'channel 1'})
		// Create a message inside it
		const {body: message} = await supertest(app)
			.post(`/api/v1/channels/${channel.id}/messages`)
			.send({
				author: 'diana',
				 content: 'test'
				})
			.expect(201)
		message.should.match({
			author: 'diana',
			creation: (it) => it.should.be.approximately(Date.now(), 1000),
			content: 'test'
			});	
		
		// Check it was correctly inserted
		const {body: messages} = await supertest(app)
			.get(`/api/v1/channels/${channel.id}/messages/`)
			messages.length.should.eql(1)
	  
	});
		

	
	
	//TODO update message with all cases
	it('update message with all cases', async () => {
		// Create a channel
		const {body: channel} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
		// Create a message inside it
		const {body: message} = await supertest(app)
			.put(`/api/v1/channels/${channel.id}/messages`)
			.send({author: 'diana', content: 'test'})
			.expect(201)
		message.should.match({
			author: 'diana',
			creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
			content: 'test'
		})
		// Check it was correctly inserted
		const {body: messages} = await supertest(app)
			.get(`/api/v1/channels/${channel.id}/messages`)
			messages.length.should.eql(1)
	});

	//TODO delete message with all cases
	it('delete message with all cases',async() => {
		// Create a channel
		const {body: channel} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
		// Create a message inside it
		const {body: message} = await supertest(app)
			.delete(`/api/v1/channels/${channel.id}/messages`)
			.send({author: 'diana', content: 'test'})
			.expect(201)
		message.should.match({
			author: 'diana',
			creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
			content: 'test'
		})
		// Check it was correctly inserted
		const {body: messages} = await supertest(app)
			.get(`/api/v1/channels/${channel.id}/messages`)
			messages.length.should.eql(1)
	});

    
});
