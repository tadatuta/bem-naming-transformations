const assert = require('assert');
const BemEntityName = require('@bem/sdk.entity-name');
const transform = require('..');

const testCases = [
    {
        case: 'block',
        schemes: {
            origin: { block: 'b1' },
            react: { block: 'B1' }
        }
    },
    {
        case: 'block with long name',
        schemes: {
            origin: { block: 'b1-with-long-name' },
            react: { block: 'B1WithLongName' }
        }
    },
    {
        case: 'elem',
        schemes: {
            origin: { block: 'b1', elem: 'e1' },
            react: { block: 'B1', elem: 'E1' }
        }
    },
    {
        case: 'elem with long name',
        schemes: {
            origin: { block: 'b1-with-long-name', elem: 'elem-with-long-name' },
            react: { block: 'B1WithLongName', elem: 'ElemWithLongName' }
        }
    },
    {
        case: 'boolean modifier',
        schemes: {
            origin: { block: 'b1', mod: { name: 'mod', val: true } },
            react: { block: 'B1', mod: { name: 'mod', val: true } },
        }
    },
    {
        case: 'key/value modifier',
        schemes: {
            origin: { block: 'b1', mod: { name: 'mod', val: 'val' } },
            react: { block: 'B1', mod: { name: 'mod', val: 'val' } }
        }
    },
    {
        case: 'elem boolean modifier',
        schemes: {
            origin: { block: 'b1', elem: 'e1', mod: { name: 'mod', val: true } },
            react: { block: 'B1', elem: 'E1', mod: { name: 'mod', val: true } }
        }
    },
    {
        case: 'elem key/value modifier',
        schemes: {
            origin: { block: 'b1', elem: 'e1', mod: { name: 'mod', val: 'val' } },
            react: { block: 'B1', elem: 'E1', mod: { name: 'mod', val: 'val' } }
        }
    }
];

function run(sourceScheme, targetScheme) {
    describe(`${sourceScheme} -> ${targetScheme}`, () => {
        testCases.forEach(testCase => {
            const sourceEntity = BemEntityName.create(testCase.schemes[sourceScheme]);
            const targetEntity = BemEntityName.create(testCase.schemes[targetScheme]);
            const actual = transform(sourceEntity, { naming: targetScheme, ...testCase.opts });;

            it(testCase.case, () => assert.deepEqual(actual, targetEntity));
        });
    });
}

run('origin', 'react');
run('react', 'origin');
run('origin', 'origin');
run('react', 'react');

describe('custom', () => {
    it('should add prefix', () => {
        const sourceEntity = BemEntityName.create({ block: 'b1', elem: 'e1' });
        const targetEntity = BemEntityName.create({ block: 'b-b1', elem: 'e1' });

        const actual = transform(sourceEntity, { naming: 'origin', transforms: { prefix: 'b-' } });

        assert.deepEqual(actual, targetEntity);
    });

    it('should support transforms', () => {
        const sourceEntity = BemEntityName.create({ block: 'b1', elem: 'e1' });
        const targetEntity = BemEntityName.create({ block: 'other-block', elem: 'some-other-elem' });

        const dict = {
            b1: 'other-block',
            e1: 'some-other-elem'
        };

        const actual = transform(sourceEntity, {
            naming: 'origin',
            transforms: {
                block: block => dict[block] || block,
                elem: elem => dict[elem] || elem
            }
        });

        assert.deepEqual(actual, targetEntity);
    });
});