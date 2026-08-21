import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { mockLocations, mockProviders } from './fixtures';

const resolvers = new Set();
let realGet = null;

function dispatch(url) {
  for (const resolverRef of Array.from(resolvers)) {
    const result = resolverRef.current(url);
    if (result !== undefined) {
      return result;
    }
  }
  return realGet(url);
}

function registerResolver(resolverRef) {
  if (resolvers.size === 0) {
    realGet = httpInterceptor.get;
    httpInterceptor.get = dispatch;
  }
  resolvers.add(resolverRef);
}

function unregisterResolver(resolverRef) {
  resolvers.delete(resolverRef);
  if (resolvers.size === 0 && realGet) {
    httpInterceptor.get = realGet;
    realGet = null;
  }
}

/**
 * Mounts a URL-scoped stub over `httpInterceptor.get` for as long as `children` stays
 * mounted. `resolveUrl(url)` should return a Promise for URLs it recognises, and
 * `undefined` for anything else so the dispatcher can try the next stub (or the real
 * implementation).
 *
 * Two details matter here, both reproduced failure modes of a naive swap/restore stub:
 *
 * 1. Registration happens synchronously in the render body, not in a `useEffect`.
 *    Location/Provider fetch their data in `componentDidMount`, and React runs a child's
 *    `componentDidMount` before its parent's effects, so registering in an effect would
 *    install the stub one tick too late for the very first fetch.
 * 2. `resolveUrl` is written into a ref on every render (not just captured once via
 *    `useRef(resolveUrl)`), so a component instance that Storybook keeps mounted across a
 *    story swap always serves the newest resolver instead of the one from its first mount.
 */
export function HttpGetStub({ resolveUrl, children }) {
  const resolverRef = useRef(resolveUrl);
  resolverRef.current = resolveUrl;

  const isRegisteredRef = useRef(false);
  if (!isRegisteredRef.current) {
    registerResolver(resolverRef);
    isRegisteredRef.current = true;
  }

  useEffect(() => () => unregisterResolver(resolverRef), []);

  return children;
}

HttpGetStub.propTypes = {
  children: PropTypes.node.isRequired,
  resolveUrl: PropTypes.func.isRequired,
};

/**
 * Builds a Storybook decorator that mounts an HttpGetStub with a fixed resolver.
 *
 * Returns a NAMED function declaration rather than an anonymous curried
 * `(resolver) => (Story) => <JSX/>` — the anonymous form trips the `react/display-name`
 * ESLint rule (an error under this project's `plugin:react/recommended` config).
 */
export function createHttpGetStubDecorator(resolveUrl) {
  function HttpGetStubDecorator(Story) {
    return (
      <HttpGetStub resolveUrl={resolveUrl}>
        <Story />
      </HttpGetStub>
    );
  }
  return HttpGetStubDecorator;
}

const urlIncludes = (fragment) => (url) => url.includes(fragment);

export const withLocationHttp = createHttpGetStubDecorator((url) => (
  urlIncludes('/location')(url) ? Promise.resolve({ results: mockLocations }) : undefined
));

export const withProviderHttp = createHttpGetStubDecorator((url) => (
  urlIncludes('/provider')(url) ? Promise.resolve({ results: mockProviders }) : undefined
));
