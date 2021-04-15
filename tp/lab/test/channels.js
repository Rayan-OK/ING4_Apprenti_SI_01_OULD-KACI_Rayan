const app = require('../app');
const db = require('../db_config');
const supertest = require('supertest');

describe('channel api tests', () => {
	beforeEach(async () => {
		await db.clear(); //on va clean la base de données
	});

	it('list empty', async () => {
		// Return an empty channel list by default
		await supertest(app)
			.get('/api/v1/channels')
			.expect(200, []);
	});

	it('list one element', async () => {
		// Create a channel
		const channel = {
			id: '123',
			name: 'name',
		};
		await db.put(`channels:${channel.id}`, JSON.stringify(channel));

		// Ensure we list the channels correctly
		await supertest(app)
			.get('/api/v1/channels')
			.expect(200, [{
				id: '123',
				name: 'name',
			}]);
	});

	it('create new channel name not given', async () => {
		await supertest(app)
			.post('/api/v1/channels')
			.expect(400, {name: 'Name is required.'});
	});

	it('create new channel', async () => {
		const {body: channel} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
			.expect(201);

		channel.should.match({
			id: /^\w+-\w+-\w+-\w+-\w+$/, //on utilise une regex pour dire que notre id correspond bien à un uui
			name: 'channel 1'
		})
		// Check it was correctly inserted
		const {body: channels} = await supertest(app)
		.get('/api/v1/channels')
		channels.length.should.eql(1)		
	});

	it('show channel', async () => {
		// Create a channel
		const {body: channel1} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
		// Check it was correctly inserted
		const {body: channel} = await supertest(app)
			.get(`/api/v1/channels/${channel1.id}`)
			.expect(200)
		channel.name.should.eql('channel 1')
	});

	//TODO show channel with id who does not exist
    it(' show channel with id who does not exist',async()=>{
        return new Promise( (resolve, reject) => {
            const channels = []
            db.createReadStream({
              gt: "channels:",
              lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
            }).on( 'data', ({key, value}) => {
              channel = JSON.parse(value)
              channel.id = key.split(':')[1]
              channels.push(channel)
            }).on( 'error', (err) => {
              reject(err)
            }).on( 'end', () => {
              resolve(channels)
            })
          })
    });

    it('update channel with all cases',async () => {
		const channel = {
			id: '123',
			name: 'channel 1',
		};		
		const res = await supertest(app)
		.put(`/api/v1/channels/${channel.id}`)
		.send({
			name: 'Update Test name',
		})
		console.log('Update a channel!')
    });

       
    //TODO delete channel with all cases
    it('delete channel with all cases',async() => {
		const {body: channel1} = await supertest(app)
			.post('/api/v1/channels')
			.send({name: 'channel 1'})
		// Check it was correctly inserted
		const {body: channel} = await supertest(app)
			.delete(`/api/v1/channels/${channel1.id}`)
			.expect(200)
	});
});