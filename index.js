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
            transforms.block(entity.block),
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

function shouldTransform(entity, blacklist) {
    if (!blacklist || !blacklist.length) return true;

    const entityBlacklist = new Set();
    blacklist.forEach(item => {
        entityBlacklist.add(BemEntityName.create(
            typeof item === 'string' ?
                { block: item } :
                item
        ).toString());
    });

    return !entityBlacklist.has(entity.toString());
}

/*
 * entity {BemEntityName} - representation of BEM entity
 * opts {object} - options
 * options.naming {string|boolean|object} ['react']
 * options.blacklist [string|{}] - array of strings or objects representing BEM entity to ignore
 * [transforms] {object} - custom transformations
 * transforms.block {function}
 * transforms.elem {function}
 * transforms.modName {function}
 * transforms.modVal {function}
 * transforms.prefix {string}
 * @returns {BemEntityName}
 */
function bemEntityNameTransform(entity, options) {
    const opts = Object.assign({}, options);

    if (!shouldTransform(entity, options.blacklist)) {
        return entity;
    }

    const naming = opts.naming === undefined ? 'react' : opts.naming;
    const result = presets[naming] ? presets[naming](entity) : entity;

    return opts.transforms ? transform(result, opts.transforms) : result;
};

module.exports = bemEntityNameTransform;
