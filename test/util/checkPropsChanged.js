const test = require('ava');
const check = require('../../app/scripts/util/checkPropsChanged');

test('checkPropsChanged', t => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2, c: 3 };

    t.false(check(obj1, obj2));
    t.false(check(obj1, obj2, 'a'));
    t.false(check(obj1, obj2, 'b'));
    t.false(check(obj1, obj2, 'a', 'b', 'c'));
    t.false(check(obj1, obj2, 'a', 'b', 'c', 'd'));

    obj1.b = 23;

    t.false(check(obj1, obj2));
    t.false(check(obj1, obj2, 'a'));
    t.true(check(obj1, obj2, 'b'));
    t.true(check(obj1, obj2, 'a', 'b', 'c'));
    t.true(check(obj1, obj2, 'a', 'b', 'c', 'd'));
});

test('checkPropsChanged should throw on receiving non-objects', t => {
    t.throws(() => check('abc', 'def'));
    t.throws(() => check({}, 'def'));
    t.throws(() => check('abc', {}));
    t.throws(() => check(1, 2));
    t.throws(() => check(null, null));
    t.throws(() => check());
});
