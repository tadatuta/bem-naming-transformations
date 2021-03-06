const BemEntityName = require('@bem/sdk.entity-name');
const { toCamelCase, toKebabCase } = require('./lib/helpers');

const defaultNameTransform = {
    block: block => block,
    elem: elem => elem,
    modName: modName => modName,
    modVal: modVal => modVal
};

function transform(entity, customTransforms) {
    const transforms = Object.assign({}, defaultNameTransform, customTransforms);

    return BemEntityName.create({
        block: (transforms.prefix ? transforms.prefix : '') +
            transforms.block(entity.block) +
            (transforms.suffix ? transforms.suffix : ''),
        elem: entity.elem && transforms.elem(entity.elem),
        mod: entity.mod && {
            name: transforms.modName(entity.mod.name),
            val: transforms.modVal(entity.mod.val)
        }
    });
}

const presets = {
    origin: function(entity) {
        return transform(entity, {
            block: toKebabCase,
            elem: toKebabCase
        });
    },
    react: function(entity) {
        return transform(entity, {
            block: toCamelCase,
            elem: toCamelCase
        });
    }
}

function listToEntitySet(list) {
    const entitySet = new Set();
    list.forEach(item => {
        entitySet.add(BemEntityName.create(
            typeof item === 'string' ?
                { block: item } :
                item
        ).toString());
    });

    return entitySet;
}

function shouldTransform(entity, blacklist, whitelist) {
    if ((!whitelist || !whitelist.length) && (!blacklist || !blacklist.length)) return true;

    if (whitelist) {
        return listToEntitySet(whitelist).has(entity.toString());
    }

    return !listToEntitySet(blacklist).has(entity.toString());
}

/*
 * entity {BemEntityName} - representation of BEM entity
 * opts {object} - options
 * options.naming {string|boolean|object} ['react']
 * options.blacklist [string|{}] - array of strings or objects representing BEM entity to ignore
 * options.whitelist [string|{}] - array of strings or objects representing BEM entity to transform
 * [transforms] {object} - custom transformations
 * transforms.block {function}
 * transforms.elem {function}
 * transforms.modName {function}
 * transforms.modVal {function}
 * transforms.prefix {string}
 * transforms.suffix {string}
 * @returns {BemEntityName}
 */
function bemEntityNameTransform(entity, options) {
    const opts = Object.assign({}, options);

    if (!shouldTransform(entity, options.blacklist, options.whitelist)) {
        return entity;
    }

    const naming = opts.naming === undefined ? 'react' : opts.naming;
    const result = presets[naming] ? presets[naming](entity) : entity;

    return opts.transforms ? transform(result, opts.transforms) : result;
};

module.exports = bemEntityNameTransform;
