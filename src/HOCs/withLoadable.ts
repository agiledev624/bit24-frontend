import loadable from '@loadable/component';

export const withLoadable = ({
  loader,
  fallback = undefined
}) => loadable(loader, {fallback});