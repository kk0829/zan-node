import test from 'ava';
import Validator from '../../src/base/Validator';

const validator = new Validator();

test('contains', t => {
    try {
        validator.contains('abbc', 'bb');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.contains('abbc', 'aa');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('equals', t => {
    try {
        validator.equals('abc', 'abc');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.equals('abc', '123');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isMobilePhone', t => {
    try {
        validator.isMobilePhone('18606531399');
        validator.isMobilePhone('18606531399', 'zh-CN');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isMobilePhone('123');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isAfter', t => {
    try {
        validator.isAfter('2018-01-01');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isAfter('2017-07-01');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isBefore', t => {
    try {
        validator.isBefore('2017-07-11');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isBefore('2018-07-11');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isBoolean', t => {
    try {
        validator.isBoolean('true');
        validator.isBoolean('false');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isBoolean('123');
        validator.isBoolean('abc');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isCreditCard', t => {
    try {
        validator.isCreditCard('6222305123424113');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isCreditCard('123');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('required', t => {
    try {
        validator.required('123');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.required('');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isEmail', t => {
    try {
        validator.isEmail('test@example.com');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isEmail('example.com');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isNumeric', t => {
    try {
        validator.isNumeric('123');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isNumeric('abc');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isURL', t => {
    try {
        validator.isURL('https://www.youzan.com');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isURL('youzan');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isEmpty', t => {
    try {
        validator.isEmpty('');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isEmpty('abc');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isIP', t => {
    try {
        validator.isIP('127.0.0.1');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isIP('127');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isJSON', t => {
    try {
        validator.isJSON('{"foo":"bar"}');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isJSON('abc');
        t.fail();
    } catch (e) {
        t.pass();
    }
});

test('isLength', t => {
    try {
        validator.isLength('abc', {
            max: 5
        });
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isLength('abcdef', {
            max: 5
        });
        t.fail();
    } catch (e) {
        t.pass();
    }
});


test('isUUID', t => {
    try {
        validator.isUUID('1d88d302-c1c4-49a7-aed3-29081a9ae5b8');
        t.pass();
    } catch (e) {
        t.fail();
    }
    try {
        validator.isUUID('1d88d302-c1c4-49a7-aed3-29081a9ae5');
        t.fail();
    } catch (e) {
        t.pass();
    }
});
