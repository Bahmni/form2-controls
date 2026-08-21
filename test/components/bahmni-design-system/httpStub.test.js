import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import {
  HttpGetStub, withLocationHttp, withProviderHttp,
} from '../../../stories/bahmni-design-system/httpStub';
import { mockLocations } from '../../../stories/bahmni-design-system/fixtures';

const LOCATION_URL = '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)';
const PROVIDER_URL = '/openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)';

class MountFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    httpInterceptor.get(this.props.url).then((data) => this.setState({ data }));
  }

  render() {
    const { testId } = this.props;
    const { data } = this.state;
    return <div data-testid={testId}>{data ? JSON.stringify(data) : 'loading'}</div>;
  }
}

MountFetcher.propTypes = {
  testId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const resolveLocationUrl = (url) => (
  url.includes('/location') ? Promise.resolve({ results: mockLocations }) : undefined
);

describe('httpStub', () => {
  it('gives a mounted control the mocked data without ever calling the real implementation', async () => {
    const realHttpGet = jest.fn(() => Promise.resolve({ results: 'REAL' }));
    httpInterceptor.get = realHttpGet;

    render(
      <HttpGetStub resolveUrl={resolveLocationUrl}>
        <MountFetcher testId="loc" url={LOCATION_URL} />
      </HttpGetStub>
    );

    await waitFor(() => expect(screen.getByTestId('loc')).toHaveTextContent('General Ward'));
    expect(realHttpGet).not.toHaveBeenCalled();
  });

  it('restores the real implementation once the stub unmounts', async () => {
    const realHttpGet = jest.fn(() => Promise.resolve({ results: 'REAL' }));
    httpInterceptor.get = realHttpGet;

    const { unmount } = render(
      <HttpGetStub resolveUrl={resolveLocationUrl}>
        <MountFetcher testId="loc" url={LOCATION_URL} />
      </HttpGetStub>
    );

    await waitFor(() => expect(screen.getByTestId('loc')).toHaveTextContent('General Ward'));

    unmount();

    expect(httpInterceptor.get).toBe(realHttpGet);
  });

  it('serves each of two simultaneously mounted stubs its own data (no cross-contamination)', async () => {
    const Loc = () => <MountFetcher testId="loc" url={LOCATION_URL} />;
    const Prov = () => <MountFetcher testId="prov" url={PROVIDER_URL} />;

    render(withLocationHttp(Loc));
    render(withProviderHttp(Prov));

    await waitFor(() => {
      expect(screen.getByTestId('loc')).toHaveTextContent('General Ward');
      expect(screen.getByTestId('prov')).toHaveTextContent('Dr. John Smith');
    });

    // Cross-contamination check: Location's fetch must not have received Provider data
    // (or vice versa).
    expect(screen.getByTestId('loc')).not.toHaveTextContent('Dr. John Smith');
    expect(screen.getByTestId('prov')).not.toHaveTextContent('General Ward');
  });

  it('keeps the real implementation replaced until every mounted stub has unmounted', async () => {
    const realHttpGet = jest.fn(() => Promise.resolve({ results: 'REAL' }));
    httpInterceptor.get = realHttpGet;

    const Loc = () => <MountFetcher testId="loc" url={LOCATION_URL} />;
    const Prov = () => <MountFetcher testId="prov" url={PROVIDER_URL} />;

    const { unmount: unmountLoc } = render(withLocationHttp(Loc));
    const { unmount: unmountProv } = render(withProviderHttp(Prov));

    await waitFor(() => {
      expect(screen.getByTestId('loc')).toHaveTextContent('General Ward');
      expect(screen.getByTestId('prov')).toHaveTextContent('Dr. John Smith');
    });

    unmountLoc();
    expect(httpInterceptor.get).not.toBe(realHttpGet);

    unmountProv();
    expect(httpInterceptor.get).toBe(realHttpGet);
  });

  it('serves the newest resolver when swapped into an already-mounted stub (no unmount)', async () => {
    const resolverA = () => Promise.resolve({ results: 'A' });
    const resolverB = () => Promise.resolve({ results: 'B' });

    const { rerender } = render(
      <HttpGetStub resolveUrl={resolverA}><div /></HttpGetStub>
    );

    rerender(
      <HttpGetStub resolveUrl={resolverB}><div /></HttpGetStub>
    );

    await expect(httpInterceptor.get('/anything')).resolves.toEqual({ results: 'B' });
  });

  it('falls through to the real implementation for an unrecognised URL', async () => {
    const realHttpGet = jest.fn((url) => Promise.resolve({ results: `REAL:${url}` }));
    httpInterceptor.get = realHttpGet;

    render(
      <HttpGetStub resolveUrl={resolveLocationUrl}><div /></HttpGetStub>
    );

    const unmatchedUrl = '/openmrs/ws/rest/v1/something-else';
    await expect(httpInterceptor.get(unmatchedUrl)).resolves.toEqual({ results: `REAL:${unmatchedUrl}` });
    expect(realHttpGet).toHaveBeenCalledWith(unmatchedUrl);
  });
});
