/**
 * Video Component Stories
 *
 * Purpose: File upload control for video observations.
 * Renders a file input with a video preview area. On file selection, uploads to the
 * Bahmni document server via Util.uploadFile() and stores the resulting URL.
 *
 * Note: Full upload functionality requires a backend (Bahmni/OpenMRS server).
 * These stories show the upload UI and existing-value states only.
 *
 * Observation binding:
 *   - Value type: string (relative URL path to the uploaded video file)
 *   - Example: { uuid: '...', value: 'patient-uuid/video-filename.mp4' }
 *   - Voided values are stored as: 'patient-uuid/video-filename.mp4voided'
 *   - Video URL constructed as: /document_images/{value}
 *   - Supported formats: .mkv, .flv, .ogg, video/*, audio/3gpp
 *
 * Key props:
 *   - value (string): URL path of the stored video (undefined for empty state)
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
 *   - WCAG 1.2.2 Captions: video observations should ideally include captions at the
 *     application level; the HTML5 <video> element supports <track kind="captions">
 *   - WCAG 1.3.1 Info and Relationships: the "Upload Video" label is linked via htmlFor
 *     to the file input for programmatic association
 *   - WCAG 2.1.1 Keyboard: file input is natively focusable; HTML5 <video controls>
 *     provides keyboard-operable playback controls (Space, arrow keys)
 *   - WCAG 4.1.2 Name, Role, Value: delete/restore buttons use icon spans only —
 *     add aria-label="Delete video" / aria-label="Restore video" for screen readers
 *   - WCAG 4.1.3 Status Messages: showNotification is called on upload error;
 *     ensure the notification uses aria-live="assertive" for immediate announcement
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Video } from 'src/components/Video.jsx';
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
  title: 'Atomic Controls/Video',
  component: Video,
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for video observations (MP4, MKV, OGG, etc.). ' +
          'Shows an "Upload Video" label before a file is selected, and a video player after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.',
      },
    },
  },
};

/**
 * Default upload UI — no video selected yet.
 * Shows the "Upload Video" label placeholder.
 * Click "Choose File" to trigger the file picker.
 * Note: Actual upload will fail without a Bahmni backend.
 */
export const Default = {
  render: () => (
    <Video
      {...defaultProps}
    />
  ),
};

/** Disabled upload control — file input is not interactable. */
export const Disabled = {
  render: () => (
    <Video
      {...defaultProps}
      enabled={false}
    />
  ),
};
