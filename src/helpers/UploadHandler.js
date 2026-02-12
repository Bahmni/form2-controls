import Constants from 'src/constants';

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
      const errorMessage = data.error.message || Constants.errorMessage.uploadFailed;
      if (onError) {
        onError(errorMessage);
      }
      return false;
    }
    if (!data.url) {
      if (onError) {
        onError(Constants.errorMessage.uploadFailed);
      }
      return false;
    }
    if (onSuccess) {
      onSuccess(data.url);
    }
    return true;
  }
}

export default UploadHandler;
