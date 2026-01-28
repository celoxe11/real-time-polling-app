/**
 * Voter Identity Management
 * Handles voterToken (localStorage) and fingerprint generation
 * for anonymous voting system
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs';

const VOTER_TOKEN_KEY = 'voterToken'; // nama key di local storage

/**
 * Generate or retrieve voter token from localStorage
 * This is the primary identifier for anonymous voters
 */
export const getVoterToken = () => {
  let token = localStorage.getItem(VOTER_TOKEN_KEY);
  
  if (!token) {
    // Generate new UUID v4
    token = generateUUID();
    localStorage.setItem(VOTER_TOKEN_KEY, token);
  } 
  
  return token;
};

/**
 * Generate UUID v4 (Universally Unique Identifier)
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get browser fingerprint using FingerprintJS
 * This is the secondary identifier to prevent circumvention
 * 
 * Fingerprint is based on:
 * - Browser type and version
 * - Operating system
 * - Screen resolution
 * - Timezone
 * - Language
 * - Installed plugins
 * - Canvas fingerprinting
 * - WebGL fingerprinting
 * - Audio fingerprinting
 */
let fpPromise = null;

export const getFingerprint = async () => {
  try {
    // Initialize FingerprintJS only once
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    
    const fp = await fpPromise;
    const result = await fp.get();
    
    return result.visitorId;
  } catch (error) {
    console.error('❌ Error generating fingerprint:', error);
    // Fallback: generate a semi-random fingerprint based on available data
    return generateFallbackFingerprint();
  }
};

/**
 * Fallback fingerprint if FingerprintJS fails
 * Uses basic browser information
 */
const generateFallbackFingerprint = () => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `fallback-${Math.abs(hash).toString(36)}`;
};

/**
 * Get voter identity (both token and fingerprint)
 * Use this before voting
 */
export const getVoterIdentity = async () => {
  const voterToken = getVoterToken();
  const fingerprint = await getFingerprint();
  
  return {
    voterToken,
    fingerprint,
  };
};

/**
 * Clear voter token (for testing purposes only)
 * WARNING: This will allow the user to vote again
 */
export const clearVoterToken = () => {
  localStorage.removeItem(VOTER_TOKEN_KEY);
  console.log('🗑️ Voter token cleared');
};

/**
 * Check if voter token exists
 */
export const hasVoterToken = () => {
  return !!localStorage.getItem(VOTER_TOKEN_KEY);
};
