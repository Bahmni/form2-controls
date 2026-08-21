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
