/**
 * MUI Compatibility module
 * This module provides compatibility stubs for missing MUI components to prevent build errors
 */

// RtlProvider compatibility - used by @mui/x-date-pickers
export const RtlProvider = ({ children }) => children;
export const useRtl = () => ({ isRtl: false });

// Stub any missing MUI System components
const system = {};

export default {
  RtlProvider,
  useRtl,
  ...system
};