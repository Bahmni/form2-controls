// Storybook HTTP stubbing for the controls that fetch their option list from
// the OpenMRS REST API on mount (Location, Provider).
//
// Why this is not a simple "swap httpInterceptor.get, then put it back":
// `httpInterceptor` is a module singleton shared by every story in the preview,
// and Storybook reuses one React root across story navigation (it calls
// root.render() again rather than unmounting). A per-story swap/restore is
// therefore ordering-dependent and breaks in two ways:
//
//   * a story swapped in while another is still mounted can install its stub
//     first and have the outgoing story's restore undo it, or
//   * with two stubbed stories mounted at once (an autodocs page renders every
//     story on one page) the last install wins and BOTH stories read the same
//     mock data — Location showing provider names.
//
// So instead of swapping the whole function per story, `httpInterceptor.get` is
// replaced ONCE with a dispatcher that consults every currently-mounted
// resolver and asks each one whether it recognises the URL. Resolvers are
// URL-scoped and additive, so simultaneous stories cannot shadow each other,
// order does not matter, and anything unrecognised falls through to the real
// implementation. The original is restored only when the last stub unmounts.
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { mockLocations, mockProviders } from './fixtures';

// Resolvers of every currently-mounted HttpGetStub. A resolver returns the
// `results` array for a URL it recognises, or undefined to pass.
const activeResolvers = new Set();
let realGet = null;

const installDispatcher = () => {
  if (realGet) return;
  realGet = httpInterceptor.get;
  httpInterceptor.get = (url) => {
    for (const resolve of activeResolvers) {
      const results = resolve(url);
      if (results !== undefined) {
        return Promise.resolve({ results });
      }
    }
    return realGet(url);
  };
};

const restoreWhenIdle = () => {
  if (realGet && activeResolvers.size === 0) {
    httpInterceptor.get = realGet;
    realGet = null;
  }
};

/**
 * Registers `resolver` for as long as this subtree is mounted.
 *
 * The resolver is registered during the render phase rather than in an effect
 * because Location/Provider fetch in componentDidMount, and a child's
 * componentDidMount always runs before its parent's effects — an effect here
 * would install the mock too late to be seen.
 */
export const HttpGetStub = ({ children, resolver }) => {
  // Keep the newest resolver reachable without re-registering, so a story
  // swapped into an already-mounted stub cannot keep serving stale data.
  const resolverRef = useRef(resolver);
  resolverRef.current = resolver;

  const entryRef = useRef(null);
  if (entryRef.current === null) {
    entryRef.current = (url) => resolverRef.current(url);
    activeResolvers.add(entryRef.current);
    installDispatcher();
  }

  useEffect(() => () => {
    activeResolvers.delete(entryRef.current);
    entryRef.current = null;
    restoreWhenIdle();
  }, []);

  return children;
};

HttpGetStub.propTypes = {
  resolver: PropTypes.func.isRequired,
};

/** Builds a story decorator that serves `resolver` while the story is mounted. */
export const stubHttpGet = (resolver) => function HttpGetStubDecorator(Story) {
  return (
    <HttpGetStub resolver={resolver}>
      <Story />
    </HttpGetStub>
  );
};

export const resolveLocations = (url) => (url.includes('/location') ? mockLocations : undefined);
export const resolveProviders = (url) => (url.includes('/provider') ? mockProviders : undefined);

export const withLocationHttp = stubHttpGet(resolveLocations);
export const withProviderHttp = stubHttpGet(resolveProviders);
