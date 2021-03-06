const store = require('../../../../store');

const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getPlugin('interface.object');


/*
 * @constructor
 * @param {number} id
 * @param {number} a
 * @param {TestModel[]} nestedCollection
 * @param {TestModel} nestedObject
 */
function TestModel (id, a, nestedCollection, nestedObject) {
    this.id = id;
    this.a = a;
    this.nestedCollection = nestedCollection;
    this.nestedObject = nestedObject;
}


const TEST_COLLECTION = [
	new TestModel(1, 1, [
		new TestModel(11, 11),
		new TestModel(12, 12),
		new TestModel(13, 13)
	], new TestModel(14, 14)),
	new TestModel(2, 2, [
		new TestModel(21, 21),
		new TestModel(22, 22),
		new TestModel(23, 23)
	], new TestModel(24, 24)),
	new TestModel(3, 3, [
		new TestModel(31, 31),
		new TestModel(32, 32),
		new TestModel(33, 33)
	], new TestModel(34, 34))
];

registerSuite('QueryObjectFilter', () => {
    let queryObjectFilter;
    let objectAccessor;

    return {
        beforeEach() {
            queryObjectFilter = store.queryObjectFilter;
            objectAccessor = new store.ObjectAccessor();
        },
        'should resolve property': {
            'should return false for an incorrect value of field'() {
                assert.isFalse(queryObjectFilter.execute({"a": {"$eq": 2}}, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value of field'() {
                assert.isTrue(queryObjectFilter.execute({"a": {"$eq": 2}}, objectAccessor, TEST_COLLECTION[1]));
            },
            'should return false for an incorrect value of nested collection field'() {
                assert.isFalse(queryObjectFilter.execute({
                    "nestedCollection.a": {"$eq": 22}
                }, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value of nested collection field'() {
                assert.isTrue(queryObjectFilter.execute({
                    "nestedCollection.a": {"$eq": 22}
                }, objectAccessor, TEST_COLLECTION[1]));
            },
            'should return false for an incorrect value of nested object field'() {
                assert.isFalse(queryObjectFilter.execute({
                    "nestedObject.a": {"$eq": 24}
                }, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value of nested object field'() {
                assert.isTrue(queryObjectFilter.execute({
                    "nestedObject.a": {"$eq": 24}
                }, objectAccessor, TEST_COLLECTION[1]));
            }
        },
        '$eq operator': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({"a": {"$eq": 2}}, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({"a": {"$eq": 2}}, objectAccessor, TEST_COLLECTION[1]));
            }
        },
        '$ne operator': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({"a": {"$ne": 2}}, objectAccessor, TEST_COLLECTION[1]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({"a": {"$ne": 2}}, objectAccessor, TEST_COLLECTION[0]));
            }
        },
        '$in operator': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({"a": {"$in": [2, 3]}}, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({"a": {"$in": [2, 3]}}, objectAccessor, TEST_COLLECTION[1]));
            }
        },
        '$and operator': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({
                    "$and": [
                        {"id": {"$eq": 1}},
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[1]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({
                    "$and": [
                        {"id": {"$eq": 2}},
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[1]));
            }
        },
        '$or operator': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({
                    "$or": [
                        {"id": {"$eq": 3}},
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({
                    "$or": [
                        {"id": {"$eq": 1}},
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[1]));
            }
        },
        'nested compound operators': {
            'should return false for an incorrect value'() {
                assert.isFalse(queryObjectFilter.execute({
                    "$and": [
                        {
                            "$or": [
                                {"id": {"$eq": 1}},
                                {"id": {"$eq": 3}}
                            ]
                        },
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[0]));
            },
            'should return true for the correct value'() {
                assert.isTrue(queryObjectFilter.execute({
                    "$and": [
                        {
                            "$or": [
                                {"id": {"$eq": 1}},
                                {"id": {"$eq": 2}}
                            ]
                        },
                        {"a": {"$eq": 2}}
                    ]
                }, objectAccessor, TEST_COLLECTION[1]));
            }
        }
    };
});