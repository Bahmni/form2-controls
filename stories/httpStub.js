import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { mockLocations, mockProviders } from './bahmni-design-system/fixtures';

// Shared HTTP stub for every story whose control fetches its options over HTTP
// (Location, Provider and asynchronous AutoComplete, in both the legacy and the
// Bahmni Design System trees).
//
// It is a resolver registry rather than a plain "save the original, assign a
// mock" swap so several stubs can be mounted at the same time - `AllControls`
// needs Location and Provider stubbed simultaneously - with each resolver only
// answering the URLs it recognises and everything else falling through to the
// real implementation.

const resolvers = new Set();
// Resolvers whose paired effect has run, i.e. that belong to a render which
// actually committed. See the note on registration timing in `HttpGetStub`.
const committedResolvers = new Set();
let realGet = null;
let isPatched = false;

function dispatch(url) {
  for (const resolverRef of Array.from(resolvers)) {
    let result;
    try {
      result = resolverRef.current(url);
    } catch (error) {
      // Callers only ever `.then()` what `httpInterceptor.get` returns, so a
      // resolver that throws synchronously has to surface as a rejection
      // rather than as an exception thrown at the call site.
      return Promise.reject(error);
    }
    if (result !== undefined) {
      // A resolver is allowed to answer with a plain value; the contract this
      // stands in for always hands back a Promise.
      return Promise.resolve(result);
    }
  }
  return realGet(url);
}

function patch() {
  if (isPatched) {
    return;
  }
  realGet = httpInterceptor.get;
  httpInterceptor.get = dispatch;
  isPatched = true;
}

// Tracked with an explicit flag rather than the truthiness of `realGet` so a
// falsy real implementation still gets restored instead of leaving
// `httpInterceptor.get` permanently pointed at `dispatch`.
function restoreIfIdle() {
  if (!isPatched || resolvers.size > 0) {
    return;
  }
  httpInterceptor.get = realGet;
  realGet = null;
  isPatched = false;
}

function registerResolver(resolverRef) {
  patch();
  resolvers.add(resolverRef);
}

function unregisterResolver(resolverRef) {
  resolvers.delete(resolverRef);
  committedResolvers.delete(resolverRef);
  restoreIfIdle();
}

// A render that never commits (a sibling throwing, a Suspense retry) leaves its
// render-phase registration behind with no cleanup to pair with, which would
// keep `httpInterceptor.get` patched for the rest of the process. Once the
// commit has settled, drop every resolver no effect has claimed. If this sweep
// wins the race against the effects of a render that did commit,
// `claimResolver` puts the resolver straight back.
function sweepUnclaimedResolvers() {
  resolvers.forEach((resolverRef) => {
    if (!committedResolvers.has(resolverRef)) {
      resolvers.delete(resolverRef);
    }
  });
  restoreIfIdle();
}

function claimResolver(resolverRef) {
  committedResolvers.add(resolverRef);
  registerResolver(resolverRef);
}

export function HttpGetStub({ resolveUrl, children }) {
  const resolverRef = useRef(resolveUrl);
  resolverRef.current = resolveUrl;

  // Registration deliberately happens during render, not in the effect below:
  // the controls being stubbed fetch from `componentDidMount`, which React runs
  // before the effects of this ancestor, so a resolver registered in an effect
  // arrives too late for the mount fetch. Adding to the set is idempotent, so a
  // double-invoked render (StrictMode) is a no-op, and `sweepUnclaimedResolvers`
  // covers the render that never commits.
  if (!resolvers.has(resolverRef)) {
    registerResolver(resolverRef);
    setTimeout(sweepUnclaimedResolvers, 0);
  }

  useEffect(() => {
    claimResolver(resolverRef);
    return () => unregisterResolver(resolverRef);
  }, []);

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

export const withLocationHttp = createHttpGetStubDecorator((url) => (
  url.includes('/location') ? Promise.resolve({ results: mockLocations }) : undefined
));

export const withProviderHttp = createHttpGetStubDecorator((url) => (
  url.includes('/provider') ? Promise.resolve({ results: mockProviders }) : undefined
));
