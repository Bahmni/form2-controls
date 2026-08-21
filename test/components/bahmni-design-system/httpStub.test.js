import React, { Component } from 'react';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import '@testing-library/jest-dom';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { HttpGetStub, withLocationHttp, withProviderHttp } from '../../../stories/bahmni-design-system/httpStub';
import { mockLocations, mockProviders } from '../../../stories/bahmni-design-system/fixtures';

// Storybook's HTTP stub replaces a shared module singleton, so its correctness
// depends on what happens when stubs overlap: a story swapped in while another
// is mounted, and two stubbed stories mounted at once (an autodocs page).
// These cases are covered here because story files are outside jest's
// testMatch and cannot be tested directly.
const LOCATION_URL = '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)';
const PROVIDER_URL = '/openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)';

// Mimics Location/Provider: fetches in componentDidMount, which React runs
// before any parent effect.
class Fetcher extends Component {
  componentDidMount() {
    httpInterceptor.get(this.props.url).then((data) => this.props.onData(data.results));
  }
  render() {
    return <div>{this.props.name}</div>;
  }
}

Fetcher.propTypes = {
  name: PropTypes.string.isRequired,
  onData: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

const names = (results) => (results || []).map((r) => r.name);

describe('Storybook httpStub', () => {
  let realGet;

  beforeEach(() => {
    realGet = jest.fn(() => Promise.resolve({ results: [{ name: 'FROM REAL API' }] }));
    httpInterceptor.get = realGet;
  });

  const renderWithDecorator = (decorator, element) => {
    const Story = () => element;
    const Decorated = () => decorator(Story);
    return render(<Decorated />);
  };

  it('serves mock data to a control that fetches during componentDidMount', async () => {
    const onData = jest.fn();
    renderWithDecorator(withLocationHttp, <Fetcher name="Location" url={LOCATION_URL} onData={onData} />);

    await Promise.resolve();

    expect(names(onData.mock.calls[0][0])).toEqual(names(mockLocations));
    expect(realGet).not.toHaveBeenCalled();
  });

  it('restores the real implementation once the last stub unmounts', () => {
    const { unmount } = renderWithDecorator(
      withLocationHttp, <Fetcher name="Location" url={LOCATION_URL} onData={() => {}} />
    );

    expect(httpInterceptor.get).not.toBe(realGet);

    unmount();

    expect(httpInterceptor.get).toBe(realGet);
  });

  it('serves each control its own data when two stubbed stories are mounted at once', async () => {
    const locationData = jest.fn();
    const providerData = jest.fn();

    render(
      <div>
        <HttpGetStub resolver={(url) => (url.includes('/location') ? mockLocations : undefined)}>
          <Fetcher name="Location" url={LOCATION_URL} onData={locationData} />
        </HttpGetStub>
        <HttpGetStub resolver={(url) => (url.includes('/provider') ? mockProviders : undefined)}>
          <Fetcher name="Provider" url={PROVIDER_URL} onData={providerData} />
        </HttpGetStub>
      </div>
    );

    await Promise.resolve();

    expect(names(locationData.mock.calls[0][0])).toEqual(names(mockLocations));
    expect(names(providerData.mock.calls[0][0])).toEqual(names(mockProviders));
  });

  it('restores the real implementation only after every overlapping stub unmounts', () => {
    const { unmount } = render(
      <div>
        <HttpGetStub resolver={() => mockLocations}><div /></HttpGetStub>
        <HttpGetStub resolver={() => mockProviders}><div /></HttpGetStub>
      </div>
    );

    expect(httpInterceptor.get).not.toBe(realGet);

    unmount();

    expect(httpInterceptor.get).toBe(realGet);
  });

  it('serves the incoming story data when a story is swapped into a mounted stub', async () => {
    const onData = jest.fn();
    const Story = () => <Fetcher name="Provider" url={PROVIDER_URL} onData={onData} />;

    const { rerender } = render(
      <HttpGetStub resolver={(url) => (url.includes('/location') ? mockLocations : undefined)}>
        <div />
      </HttpGetStub>
    );

    // Same component type at the same position: React reuses the instance, so
    // a resolver captured only on first render would keep serving locations.
    rerender(
      <HttpGetStub resolver={(url) => (url.includes('/provider') ? mockProviders : undefined)}>
        <Story />
      </HttpGetStub>
    );

    await Promise.resolve();

    expect(names(onData.mock.calls[0][0])).toEqual(names(mockProviders));
  });

  it('passes URLs no resolver recognises through to the real implementation', async () => {
    renderWithDecorator(
      withProviderHttp, <Fetcher name="Other" url="/openmrs/ws/rest/v1/concept" onData={() => {}} />
    );

    await Promise.resolve();

    expect(realGet).toHaveBeenCalledWith('/openmrs/ws/rest/v1/concept');
  });
});
