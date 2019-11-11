import { IDependenciesMap, IDependency } from 'storybook-dep-webpack-plugin/runtime/types';
import { DocsContextProps, Component, CURRENT_SELECTION } from '@storybook/addon-docs/blocks';
import { getDependencyMap } from 'storybook-dep-webpack-plugin/runtime/main';

const memoize = require('memoizerific');


export interface ComponentType {
  name?: string;
}

type ComponentDependenciesFunction = (map?: IDependenciesMap, component?: ComponentType, storyDependencies?: boolean) => IDependency;


export const findComponentDependencies: ComponentDependenciesFunction = memoize(20)((map, component, storyDependencies) => {
  const { mapper } = map;
  if (mapper && component) {
    const key = Object.keys(mapper).find(key => mapper[key].id === component.name);
    if (key) {
      let module = mapper[key];
      module.key = key;
      if (module && module.dependencies) {
        const componentModule = storyDependencies ?
          null : module.dependencies.find(key => key.indexOf(component.name) > -1 && ((mapper[key] as unknown) as IDependency).dependencies);
        
        if (componentModule && mapper[componentModule] && ((mapper[componentModule] as unknown) as IDependency).dependencies) { 
          module = mapper[componentModule];
          module.key = componentModule;
        }
        return module;
      }
    }  
    return undefined;
  }
});

export type excudeFunctionType = (module: IDependency) => boolean;
export interface IDependenciesProps {
  excludeFn?: excudeFunctionType;
  of?: '.' | Component;
}

export type IDependenciesTableProps = IDependenciesProps & {
  dependents?: boolean; 
}

export interface IModulesTableProps {
  modules?: IDependency[];
}
export const getDependenciesProps = (
  { excludeFn, of, dependents }: IDependenciesTableProps,
  { parameters = {} }: DocsContextProps
): IModulesTableProps => {
  const { component, dependencies: dependenciesParam = {}} = parameters;
  const target = of === undefined || of === CURRENT_SELECTION ? component : of;
  
  if (!target) {
    return undefined;
  }
  const { storyDependencies } = dependenciesParam;
  const map = getDependencyMap();
  
  const module: IDependency = findComponentDependencies(map, component, storyDependencies);
  if (!module) {
    return undefined;
  }
  const { mapper } = map;
  let modules: IDependency[];
  if (dependents ) {
    modules = Object.keys(mapper)
      .filter(key => mapper[key].id && mapper[key].dependencies && mapper[key].dependencies.find(d => d === module['key']))
      .map(key => mapper[key]);
  } else {
    if (module.dependencies) {
      modules = module.dependencies.map(key => mapper[key]);
    }
  }
  if (modules && excludeFn) {
    modules = modules.filter(module => !excludeFn(module));
  }
  return { modules };
};