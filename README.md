# bem-naming-transformations

[BEM naming notation](https://en.bem.info/methodology/naming-convention/) transformations.

## Usage

```js
const BemEntityName = require('@bem/sdk.entity-name');
const transform = require('bem-naming-transformations');

const originEntity = BemEntityName.create({ block: 'my-block', elem: 'some-elem' });
const reactEntity = transform(originEntity, { naming: 'react' });

console.log(reactEntity); // { block: 'MyBlock', elem: 'SomeElem' }
```

### Options
* naming
* transforms

For examples please refer to [specs](https://github.com/tadatuta/bem-naming-transformations/blob/master/test/index.js).
