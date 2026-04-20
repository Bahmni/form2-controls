/**
 * Image Component Stories
 *
 * Purpose: File upload control for image and PDF observations.
 * Renders a file input with a preview area. On file selection, uploads to the
 * Bahmni document server via Util.uploadFile() and stores the resulting URL.
 *
 * Note: Full upload functionality requires a backend (Bahmni/OpenMRS server).
 * These stories show the upload UI and existing-value states only.
 *
 * Observation binding:
 *   - Value type: string (relative URL path to the uploaded document)
 *   - Example: { uuid: '...', value: 'patient-uuid/image-filename.jpg' }
 *   - Voided values are stored as: 'patient-uuid/image-filename.jpgvoided'
 *   - Image URL constructed as: /document_images/{value}
 *   - PDF files show a PDF icon instead of the image
 *
 * Key props:
 *   - value (string): URL path of the stored image/PDF (undefined for empty state)
 *   - onChange (func): called with { value, errors } after upload completes
 *   - onControlAdd (func): called when add-more should add a new instance
 *   - enabled (bool): false disables the file input
 *   - validate (bool): triggers validation display
 *   - validations (array): validation rules (e.g. mandatory)
 *   - formFieldPath (string): required for upload ID generation and add-more
 *   - patientUuid (string): used in the upload URL for patient scoping
 *   - addMore (bool): enables add-more behavior after first upload
 *   - showNotification (func): called on upload errors or unsupported file types
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.1.1 Non-text Content: uploaded images should have an alt text description
 *     at the application level; the preview <img> currently has no alt attribute
 *   - WCAG 1.3.1 Info and Relationships: the upload trigger uses a <label htmlFor={id}>
 *     linked to the hidden file input for programmatic association
 *   - WCAG 2.1.1 Keyboard: file input is natively focusable; Enter/Space activates it
 *   - WCAG 4.1.2 Name, Role, Value: delete/restore buttons use icon spans only —
 *     add aria-label="Delete image" / aria-label="Restore image" for screen readers
 *   - WCAG 4.1.3 Status Messages: showNotification is called on upload error;
 *     ensure the notification uses aria-live="assertive" for immediate announcement
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Image } from 'src/components/Image.jsx';
import '../styles/styles.scss';

const defaultProps = {
  onChange: action('onChange'),
  onControlAdd: action('onControlAdd'),
  showNotification: action('showNotification'),
  validate: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  patientUuid: 'patient-uuid-12345',
  addMore: false,
};

export default {
  title: 'Atomic Controls/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for image (JPG, PNG, etc.) and PDF observations. ' +
          'Shows a cloud upload icon before a file is selected, and a preview after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.',
      },
    },
  },
};

/**
 * Default upload UI — no image selected yet.
 * Shows the cloud upload icon placeholder.
 * Click "Choose File" (or the upload area) to trigger the file picker.
 * Note: Actual upload will fail without a Bahmni backend.
 */
export const Default = {
  render: () => (
    <Image
      {...defaultProps}
    />
  ),
};

/** Disabled upload control — file input is not interactable. */
export const Disabled = {
  render: () => (
    <Image
      {...defaultProps}
      enabled={false}
    />
  ),
};
