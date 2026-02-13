import { UploadHandler } from 'src/helpers/UploadHandler';
import Constants from 'src/constants';

describe('UploadHandler', () => {
  describe('handleUploadResponse', () => {
    let onSuccess;
    let onError;

    beforeEach(() => {
      onSuccess = jest.fn();
      onError = jest.fn();
    });

    it('should call onSuccess with URL and return true on successful upload', () => {
      const data = { url: 'http://example.com/image.jpg' };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onSuccess).toHaveBeenCalledWith('http://example.com/image.jpg');
      expect(onError).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should call onError with error message and return false when error.message exists', () => {
      const data = {
        error: {
          code: 'UNSUPPORTED_FORMAT',
          message: 'Video format quicktime is not supported',
        },
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith('Video format quicktime is not supported');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should use fallback message when error object exists but has no message property', () => {
      const data = {
        error: {
          code: 'UNKNOWN_ERROR',
          // No message property
        },
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should use fallback message when error.message is empty string', () => {
      const data = {
        error: {
          code: 'ERROR_CODE',
          message: '',
        },
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle error as non-object value (boolean) and use fallback message', () => {
      const data = {
        error: true,
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle error as string value and use fallback message', () => {
      const data = {
        error: 'Some error string',
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should not throw error when onSuccess is undefined', () => {
      const data = { url: 'http://example.com/image.jpg' };

      expect(() => {
        UploadHandler.handleUploadResponse(data, undefined, onError);
      }).not.toThrow();

      expect(onError).not.toHaveBeenCalled();
    });

    it('should call onError when data.url is missing (even without explicit error)', () => {
      const data = {
        error: undefined,
        // No url property
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(result).toBe(false);
    });

    it('should not call onSuccess when onSuccess is null', () => {
      const data = { url: 'http://example.com/image.jpg' };

      const result = UploadHandler.handleUploadResponse(data, null, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should prioritize error.message over fallback when error.message is null', () => {
      const data = {
        error: {
          code: 'ERROR',
          message: null,
        },
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(Constants.errorMessage.uploadFailed);
      expect(result).toBe(false);
    });

    it('should handle complex error message with special characters', () => {
      const complexMessage = 'Error: Expected format "mp4" but got "mov" (video/quicktime)';
      const data = {
        error: {
          message: complexMessage,
        },
      };

      const result = UploadHandler.handleUploadResponse(data, onSuccess, onError);

      expect(onError).toHaveBeenCalledWith(complexMessage);
      expect(result).toBe(false);
    });
  });
});
