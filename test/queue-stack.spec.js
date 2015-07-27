'use strict';
var expect = require('chai').expect;

describe('Queue', function(){

  var Queue = require('../lib/queue-stack').Queue;

  var queue, uniqueObj = {};
  beforeEach(function(){
    queue = new Queue();
  });

  describe('enqueue/dequeue', function(){

    it('has add/remove aliases for enqueue/dequeue', function(){
      expect(queue.add).to.equal(queue.enqueue);
      expect(queue.remove).to.equal(queue.dequeue);
    });

    it('enqueues and dequeues an item', function(){
      queue.enqueue(uniqueObj);
      expect(queue.dequeue()).to.equal(uniqueObj);
    });

    it('returns undefined on underflow (dequeue empty)', function(){
      expect(queue.dequeue()).to.equal(undefined);
    });

    it('enqueues and dequeues multiple items in a FIFO way', function(){
      queue.enqueue(5);
      queue.enqueue(uniqueObj);
      queue.enqueue('fullstack');
      expect(queue.dequeue()).to.equal(5);
      expect(queue.dequeue()).to.equal(uniqueObj);
      expect(queue.dequeue()).to.equal('fullstack');
      expect(queue.dequeue()).to.equal(undefined);
    });

    it('handles interspersed enqueue and dequeue', function(){
      queue.enqueue(1);
      expect(queue.dequeue()).to.equal(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.dequeue()).to.equal(2);
      queue.enqueue(4);
      expect(queue.dequeue()).to.equal(3);
      expect(queue.dequeue()).to.equal(4);
      expect(queue.dequeue()).to.equal(undefined);
    });

    it('enqueues and dequeues its own items', function(){
      var q2 = new Queue();
      queue.enqueue('fullstack');
      q2.enqueue('JavaScript');
      expect(q2.dequeue()).to.equal('JavaScript');
      expect(q2.dequeue()).to.equal(undefined);
      expect(queue.dequeue()).to.equal('fullstack');
      expect(queue.dequeue()).to.equal(undefined);
    });

  });

  describe('length/size', function(){

    function testLength (length) {
      return function () {
        expect(queue[length]).to.equal(0);
        queue.enqueue();
        expect(queue[length]).to.equal(1);
        queue.dequeue();
        expect(queue[length]).to.equal(0);
        queue.enqueue();
        queue.enqueue();
        expect(queue[length]).to.equal(2);
        queue.dequeue();
        queue.enqueue();
        expect(queue[length]).to.equal(2);
        queue.dequeue();
        queue.dequeue();
        expect(queue[length]).to.equal(0);
        queue.dequeue();
        expect(queue[length]).to.equal(0);
      };
    }

    it('has an accurate length property', testLength('length'));

    it('has size as an alias of length', testLength('size'));

    it('throws an error if attempting to set length/size', function(){
      function setLength () { queue.length = 100; }
      function setSize () { queue.size = 100; }
      expect(setLength).to.throw(TypeError);
      expect(setSize).to.throw(TypeError);
    });

  });

  describe('peek', function(){

    it('peeks at the head value', function(){
      expect(queue.peek()).to.equal(undefined);
      expect(queue.length).to.equal(0);
      queue.enqueue('a');
      expect(queue.peek()).to.equal('a');
      expect(queue.length).to.equal(1);
      queue.enqueue('b');
      expect(queue.peek()).to.equal('a');
      expect(queue.length).to.equal(2);
      queue.dequeue();
      expect(queue.peek()).to.equal('b');
      expect(queue.length).to.equal(1);
      queue.dequeue();
      expect(queue.peek()).to.equal(undefined);
      expect(queue.length).to.equal(0);
    });

  });

  describe('toString', function(){

    it('returns an empty string for an empty queue', function(){
      expect(queue.toString()).to.equal('');
    });

    it('returns a comma-delimited string for full queues', function(){
      expect(queue.toString()).to.equal('');
      queue.enqueue('hi');
      expect(queue.toString()).to.equal('hi');
      queue.enqueue('hello');
      expect(queue.toString()).to.equal('hi,hello');
      queue.enqueue(5);
      expect(queue.toString()).to.equal('hi,hello,5');
      queue.enqueue({});
      expect(queue.toString()).to.equal('hi,hello,5,[object Object]');
      queue.dequeue();
      expect(queue.toString()).to.equal('hello,5,[object Object]');
      queue.dequeue();
      expect(queue.toString()).to.equal('5,[object Object]');
      queue.dequeue();
      expect(queue.toString()).to.equal('[object Object]');
      queue.dequeue();
      expect(queue.toString()).to.equal('');
    });

  });

  describe('toArray', function(){

    it('returns an empty array for an empty queue', function(){
      expect(queue.toArray()).to.deep.equal([]);
    });

    it('returns an array of elements for full queues', function(){
      expect(queue.toArray()).to.deep.equal([]);
      queue.enqueue('hi');
      expect(queue.toArray()).to.deep.equal(['hi']);
      queue.enqueue('hello');
      expect(queue.toArray()).to.deep.equal(['hi', 'hello']);
      queue.enqueue(5);
      expect(queue.toArray()).to.deep.equal(['hi', 'hello', 5]);
      queue.enqueue(uniqueObj);
      expect(queue.toArray()).to.deep.equal(['hi', 'hello', 5, uniqueObj]);
      queue.dequeue();
      expect(queue.toArray()).to.deep.equal(['hello', 5, uniqueObj]);
      queue.dequeue();
      expect(queue.toArray()).to.deep.equal([5, uniqueObj]);
      queue.dequeue();
      expect(queue.toArray()).to.deep.equal([uniqueObj]);
      queue.dequeue();
      expect(queue.toArray()).to.deep.equal([]);
    });

  });

});
