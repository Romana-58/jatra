import * as crypto from 'crypto';

/**
 * Random generation utility functions
 */
export class RandomUtil {
  /**
   * Generate random OTP code
   */
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  /**
   * Generate random alphanumeric string
   */
  static generateAlphanumeric(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      result += chars[randomIndex];
    }
    
    return result;
  }

  /**
   * Generate UUID v4
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Generate PNR (Passenger Name Record) - 10 characters
   */
  static generatePNR(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = this.generateAlphanumeric(4).toUpperCase();
    return `${timestamp}${random}`.substring(0, 10);
  }

  /**
   * Generate booking reference
   */
  static generateBookingRef(): string {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}${timestamp}`;
  }

  /**
   * Generate transaction ID
   */
  static generateTransactionId(): string {
    const prefix = 'TXN';
    const timestamp = Date.now();
    const random = crypto.randomInt(1000, 9999);
    return `${prefix}${timestamp}${random}`;
  }
}
