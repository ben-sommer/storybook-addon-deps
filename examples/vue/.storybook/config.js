import { configure, addParameters, addDecorator } from '@storybook/vue';
import { DocsPage } from 'storybook-addon-deps/blocks';
import { withDependenciesContext } from 'storybook-addon-deps';

import Vue from 'vue';
import Vuex from 'vuex';

import Button from '../src/stories/Button.vue';

Vue.component('my-button', Button);
Vue.use(Vuex);

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
  docs: {
    inlineStories: true,
    iframeHeight: '60px',
    page: DocsPage,
  },
});

addDecorator(withDependenciesContext);

configure(require.context('../src/stories', true, /\.stories\.(js|mdx)$/), module);
