import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Hash utility functions
 */
export class HashUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate random hash (for tokens, IDs, etc.)
   */
  static generateRandomHash(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate SHA256 hash
   */
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate HMAC signature
   */
  static hmacSha256(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  static verifyHmac(data: string, signature: string, secret: string): boolean {
    const computedSignature = this.hmacSha256(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  }
}
