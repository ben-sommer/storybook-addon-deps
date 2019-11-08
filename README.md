# storybook-addon-deps

A storybook addon to add a dependencies tree exporer tab.<br />
Works in conjunction with [storybook-dep-webpack-plugin](https://github.com/atanasster/storybook-dep-webpack-plugin/)

![Dependencies plugin](./doc/storybook_dependencies.gif)

## DocsPage demo 
[grommet-controls](https://atanasster.github.io/grommet-controls/?path=/docs/controls-controls-avatar--main)

## Install and configure `storybook-dep-webpack-plugin`
[storybook-dep-webpack-plugin](https://github.com/atanasster/storybook-dep-webpack-plugin/blob/master/README.md)


## Installation
```sh
npm i -D storybook-addon-deps
```

## Usage
In your storybook config.js, define some global parameters to exchange the data collected by the `storybook-dep-webpack-plugin`


```js
import { configure, addDecorator, addParameters } from '@storybook/{yourframework}';

addParameters({
 dependencies: {
    //display the dependencies of the story instead of component
    //by default this is false
    storyDependencies: true,
  }
});
```

## A. Add a dependencies tab to storybookjs (optional)

in the `addons.js` file in your storybook config, register `storybook-addon-deps`:

```js
import 'storybook-addon-deps/register';
```

in the `config.js` file, add the dependeny context provider (in order to exchange data with the dependencies tab panel)
```js
import { configure, addDecorator, addParameters } from '@storybook/{yourframework}';
import { withDependenciesContext } from 'storybook-addon-deps';
...
addDecorator(withDependenciesContext);
...
```

## B. Add a documentation block to your DocsPage (optional)
DocsPage is the zero-config default documentation that all stories get out of the box.
You can add a **Dependencies** block to any level to your storybook

**Globally (config.js)**

```js
import { DocsPage } from 'storybook-addon-deps/blocks/DocsPage';
addParameters({ docs: { page: DocsPage } });
```

**Component-level (Button.stories.js)**

```js
import { Button } from './Button';
import { DocsPage } from 'storybook-addon-deps/blocks/DocsPage';
export default {
  title: 'Demo/Button',
  component: Button,
  parameters: { docs: { page: DocsPage } },
};
```

**Story-level (Button.stories.js)**

```js
import { Button } from './Button';
import { DocsPage } from 'storybook-addon-deps/blocks/DocsPage';
// export default { ... }
export const basic => () => <Button>Basic</Button>
basic.story = {
  parameters: { docs: { page: DocsPage } }
}
```

## C. Add dependencies and dependents doc blocks to mdx stories (optional)
**Button.stories.mdx**

```jsx
import {
  Story,
  Preview,
  Props,
  Description,
  Meta,
} from '@storybook/addon-docs/blocks';
import { Button } from '@storybook/design-system/dist/components/Button';
import { Dependencies, Dependents } from 'storybook-addon-deps/blocks';

<Meta
  title="Design System|Button"
  component={Button}
  parameters={{ component: Button }}
/>

# Selected story

<Preview withToolbar={true}>
  <Story id="." />
</Preview>

# Properties
<Props of={Button} />

# Dependencies doc block
<Dependencies of={Button} />

# Dependents doc block
<Dependents of={Button} />
```
