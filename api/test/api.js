/* eslint-env mocha */

import chai from 'chai';
import chaiHttp from 'chai-http';
import os from 'os';
import 'chai/register-should';

import initApp from '../src';

chai.use(chaiHttp);

describe('api', () => {
  let app;
  before((done) => {
    initApp().then((that) => {
      app = that;
      done();
    });
  });

  it('should hello', (done) => {
    chai.request(app)
      .get('/api/hello')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.deep.equal({ result: 'Hello, world.' });
        done();
      });
  });

  it('should get hostname', (done) => {
    chai.request(app)
      .get('/api/hostname')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.deep.equal({ result: os.hostname() });
        done();
      });
  });
});
