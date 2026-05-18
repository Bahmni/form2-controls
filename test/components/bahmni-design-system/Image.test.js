import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Image } from 'components/bahmni-design-system/Image.jsx';
import { Util } from 'helpers/Util';
import constants from 'src/constants';

jest.mock('helpers/Util', () => ({
  Util: {
    getFileType: jest.fn(),
    uploadFile: jest.fn(),
  },
}));

const mockFileReader = {
  readAsDataURL: jest.fn(),
  onloadend: jest.fn(),
  result: '',
};

global.FileReader = jest.fn(() => mockFileReader);

describe('Carbon Image', () => {
  let mockOnChange;
  let mockOnControlAdd;
  let mockShowNotification;
  const formFieldPath = 'test1.1/1-0';

  beforeEach(() => {
    mockOnChange = jest.fn();
    mockOnControlAdd = jest.fn();
    mockShowNotification = jest.fn();

    Util.getFileType.mockReturnValue('image');
    Util.uploadFile.mockResolvedValue({
      json: () => Promise.resolve({ url: 'someUrl' }),
    });

    mockFileReader.readAsDataURL.mockImplementation(function () {
      setTimeout(() => {
        this.onloadend({ target: { result: 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU' } });
      }, 0);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderImage = (props = {}) => render(
    <Image
      addMore
      formFieldPath={formFieldPath}
      onChange={mockOnChange}
      onControlAdd={mockOnControlAdd}
      showNotification={mockShowNotification}
      validate={false}
      validations={[]}
      {...props}
    />
  );

  it('should render Carbon Image with file input and correct accept types', () => {
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'application/pdf,image/*');
  });

  it('should upload image file to server', async () => {
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(Util.uploadFile).toHaveBeenCalledWith(
        'data:image/jpeg;base64,/9j/4SumRXhpZgAATU',
        undefined,
        'image'
      );
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({ value: 'someUrl', errors: [] });
    });
  });

  it('should not upload if file type is not supported', () => {
    Util.getFileType.mockReturnValue('not_supported');
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockShowNotification).toHaveBeenCalledWith(
      constants.errorMessage.fileTypeNotSupported,
      constants.messageType.error
    );
    expect(Util.uploadFile).not.toHaveBeenCalled();
  });

  it('should handle backend error response and show error message', async () => {
    const errorMessage = 'Could not save patient document';
    Util.uploadFile.mockResolvedValue({
      json: () => Promise.resolve({
        error: {
          code: 'org.bahmni.module.bahmnicore:95',
          message: errorMessage,
        },
      }),
    });
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(errorMessage, constants.messageType.error);
    });
    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should handle upload failure and show error notification', async () => {
    Util.uploadFile.mockImplementation(() => Promise.reject('Network error'));
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        constants.errorMessage.uploadFailed,
        constants.messageType.error
      );
    });
  });

  it('should display filename when value is set', () => {
    renderImage({ value: 'patient/documents/test.jpg' });

    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  it('should show delete button when file is uploaded', () => {
    const { container } = renderImage({ value: 'someValue' });

    expect(container.querySelector('.cds--file-close')).toBeInTheDocument();
  });

  it('should call onChange with voided value when delete is clicked', () => {
    const { container } = renderImage({ value: 'someValue' });

    const deleteButton = container.querySelector('.cds--file-close');
    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith({ value: 'someValuevoided', errors: [] });
  });

  it('should show restore button when file is voided', () => {
    const { container } = renderImage({ value: 'someValuevoided' });

    expect(container.querySelector('.restore-button-inline')).toBeInTheDocument();
  });

  it('should render restore button as design system ghost icon button', () => {
    renderImage({ value: 'someValuevoided' });

    const restoreButton = screen.getByRole('button', { name: 'Restore image' });
    expect(restoreButton).toHaveClass('cds--btn--ghost');
  });

  it('should hide restore button and call onChange with restored value when restore is clicked', () => {
    const { container } = renderImage({ value: 'someValuevoided' });

    const restoreButton = container.querySelector('.restore-button-inline');
    fireEvent.click(restoreButton);

    expect(mockOnChange).toHaveBeenCalledWith({ value: 'someValue', errors: [] });
  });

  it('should apply carbon-error class when validation fails', () => {
    const { container } = renderImage({ validations: ['mandatory'] });

    const fileInput = container.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: undefined, configurable: true });
    fireEvent.change(fileInput, { target: { files: undefined } });

    expect(container.querySelector('.carbon-image-upload')).toHaveClass('carbon-error');
  });

  it('should not apply carbon-error class for add-more instance (formFieldPath suffix != 0)', () => {
    const { container } = renderImage({
      validations: ['mandatory'],
      formFieldPath: 'test1.1/1-1',
    });

    const fileInput = container.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: undefined, configurable: true });
    fireEvent.change(fileInput, { target: { files: undefined } });

    expect(container.querySelector('.carbon-image-upload')).not.toHaveClass('carbon-error');
  });

  it('should disable file input when enabled is false', () => {
    const { container } = renderImage({ enabled: false });

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeDisabled();
  });

  it('should call onControlAdd without notification when value exists on mount', async () => {
    renderImage({ value: 'someValue' });

    await waitFor(() => {
      expect(mockOnControlAdd).toHaveBeenCalledWith(formFieldPath, false);
    });
  });

  it('should not call onControlAdd when no value on mount', () => {
    renderImage({ value: undefined });

    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should not call onControlAdd when addMore is false', () => {
    renderImage({ addMore: false, value: 'someValue' });

    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should call onControlAdd with notification after successful upload', async () => {
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockOnControlAdd).toHaveBeenCalledWith(formFieldPath, true);
    });
  });

  it('should show Loading indicator while uploading', async () => {
    const { container } = renderImage();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(container.querySelector('.cds--loading')).toBeInTheDocument();
  });

  it('should display upload label and description text', () => {
    renderImage();

    expect(screen.getByText('Upload files')).toBeInTheDocument();
    expect(screen.getByText(/Max file size/)).toBeInTheDocument();
  });
});
