import Constants from '../constants';

export class UploadHandler {
  /**
   * Handles upload response from backend
   * @param {Object} data - The response data from upload
   * @param {Function} onSuccess - Callback when upload succeeds (receives data.url)
   * @param {Function} onError - Callback when upload fails (receives error message)
   * @returns {boolean} - True if successful, false if error occurred
   */
  static handleUploadResponse(data, onSuccess, onError) {
    if (data.error) {
      const errorMessage = (data.error && data.error.message) || Constants.errorMessage.uploadFailed;
      onError(errorMessage);
      return false;
    }
    if (onSuccess && data.url) {
      onSuccess(data.url);
    }
    return true;
  }
}

export default UploadHandler;
