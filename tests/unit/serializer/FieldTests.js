const store = require('../../../store');

const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getPlugin('interface.object');


/*
 * @constructor
 * @param {number} a
 */
function TestModel (a) {
    this.a = a;
}


registerSuite('Field', () => {
    const expected = {
        value: 5,
        objName: 'a'
    };
    let field;
    let obj;

    return {
        beforeEach() {
            obj = new TestModel(expected.value);
        },
        'default behaviour': {
            beforeEach() {
                field = new store.Field(expected.objName);
            },
            'getName'() {
                const name = field.getName();
                assert.equal(name, expected.objName);
            },
            'load'() {
                const value = field.load({[expected.objName]: expected.value});
                assert.deepEqual(value, expected.value);
            },
            'dump'() {
                const record = field.dump(expected.a);
                assert.deepEqual(record, {[expected.objName]: expected.value});
            },
            'loadError'() {
                const expectedMsg = "Error msg";
                const msg = field.load({[expected.objName]: expectedMsg});
                assert.deepEqual(msg, expectedMsg);
            }
        }
    };
});