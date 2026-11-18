import FormContext from './FormContext';
import { httpInterceptor } from '../helpers/httpInterceptor';
import { base64ToUtf8, looksLikeBase64 } from './encodingUtils';

export default class ScriptRunner {

  constructor(rootRecord, patient, parentRecord) {
    this.formContext = new FormContext(rootRecord, patient, parentRecord);
    this.interceptor = httpInterceptor;
  }

  convertToUTF8(str) {
    return looksLikeBase64(str) ? base64ToUtf8(str) : str;
  }

  execute(eventJs) {
    const formContext = this.formContext;
    const interceptor = this.interceptor;
    if (eventJs && interceptor) {
      const executiveJs = `(${this.convertToUTF8(eventJs)})(formContext,interceptor)`;
      /* eslint-disable */
      eval(executiveJs);
    }
    return formContext.getRecords();
  }

}
