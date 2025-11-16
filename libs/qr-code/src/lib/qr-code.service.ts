import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import {
  QRCodeData,
  QRCodeOptions,
  QRCodeResult,
  QRCodeVerification,
} from './qr-code.interface';

/**
 * QR Code Service for ticket generation and validation
 */
export class QRCodeService {
  private static readonly SECRET_KEY = process.env.QR_SECRET_KEY || 'your-secret-key';

  /**
   * Generate QR code for ticket
   */
  static async generateTicketQR(
    data: Omit<QRCodeData, 'signature'>,
    options?: QRCodeOptions
  ): Promise<QRCodeResult> {
    // Add HMAC signature for verification
    const signature = this.generateSignature(data);
    const qrData: QRCodeData = { ...data, signature };

    // Convert to JSON string
    const dataString = JSON.stringify(qrData);

    // Generate QR code
    const defaultOptions: QRCodeOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      ...options,
    };

    try {
      const dataUrl = await QRCode.toDataURL(dataString, {
        errorCorrectionLevel: defaultOptions.errorCorrectionLevel,
        type: defaultOptions.type,
        quality: defaultOptions.quality,
        margin: defaultOptions.margin,
        width: defaultOptions.width,
        color: defaultOptions.color,
      });

      return { dataUrl };
    } catch (error) {
      throw new Error(
        `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verify and decode QR code data
   */
  static verifyTicketQR(qrDataString: string): QRCodeVerification {
    try {
      const data: QRCodeData = JSON.parse(qrDataString);

      // Verify signature
      const { signature, ...dataWithoutSignature } = data;
      const expectedSignature = this.generateSignature(dataWithoutSignature);

      if (signature !== expectedSignature) {
        return {
          isValid: false,
          error: 'Invalid QR code signature',
        };
      }

      return {
        isValid: true,
        data,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid QR code data format',
      };
    }
  }

  /**
   * Generate HMAC signature for QR data
   */
  private static generateSignature(
    data: Omit<QRCodeData, 'signature'>
  ): string {
    const dataString = JSON.stringify(data);
    return crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(dataString)
      .digest('hex');
  }

  /**
   * Generate SVG QR code
   */
  static async generateSVG(
    data: Omit<QRCodeData, 'signature'>,
    options?: QRCodeOptions
  ): Promise<string> {
    const signature = this.generateSignature(data);
    const qrData: QRCodeData = { ...data, signature };
    const dataString = JSON.stringify(qrData);

    try {
      return await QRCode.toString(dataString, {
        type: 'svg',
        errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
        margin: options?.margin || 1,
        width: options?.width || 300,
      });
    } catch (error) {
      throw new Error(
        `Failed to generate SVG QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Extract data from QR code string without verification (for display purposes)
   */
  static extractData(qrDataString: string): QRCodeData | null {
    try {
      return JSON.parse(qrDataString) as QRCodeData;
    } catch {
      return null;
    }
  }
}
