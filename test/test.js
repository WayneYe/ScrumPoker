var assert = require("assert"),
should = require("should"),
_ = require("underscore");

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
            assert.equal("a", "a");
        });
    });

    describe("Some foo test", function(){
        it("should correctly executes underscore", function() {
            var arr = _.range(0, 100, 8);
            console.log(arr); // [ 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96 ]
            arr.should.include(8);
        });
    });
});
