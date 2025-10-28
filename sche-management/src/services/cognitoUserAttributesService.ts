import { CognitoIdentityProviderClient, GetUserCommand, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

/**
 * Service to fetch and update user attributes from AWS Cognito
 * This uses the user's access token, so it's client-safe (no admin credentials exposed)
 */
class CognitoUserAttributesService {
  private region: string;
  private userPoolId: string;

  constructor() {
    this.region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2";
    this.userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || "ap-southeast-2_9RLjNQhOk";
  }

  /**
   * Decode JWT token to get claims
   */
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return {};
    }
  }

  /**
   * Fetch user attributes from ID token
   * Note: Custom attributes will only be returned if they are configured to be in the ID token
   * @param idToken - ID token from OIDC auth
   * @returns User attributes object
   */
  async fetchUserAttributes(idToken: string): Promise<Record<string, any>> {
    try {
      // Decode ID token to get user attributes
      const claims = this.decodeJWT(idToken);
      
      // Convert claims to attributes format
      const attributes: Record<string, any> = {};
      
      // Add standard attributes
      if (claims.email) attributes.email = claims.email;
      if (claims.name) attributes.name = claims.name;
      if (claims.phone_number) attributes.phone_number = claims.phone_number;
      
      // Add custom attributes from ID token
      Object.keys(claims).forEach(key => {
        if (key.startsWith('custom:')) {
          attributes[key] = claims[key];
        }
      });
      
      console.log('Decoded attributes from ID token:', attributes);
      
      return attributes;
    } catch (error) {
      console.error("Error fetching user attributes:", error);
      throw new Error("Không thể lấy thông tin người dùng");
    }
  }

  /**
   * Update user attributes in Cognito
   * @param accessToken - User's access token from OIDC auth
   * @param attributes - Object with attribute names (without 'custom:' prefix) and values
   */
  async updateUserAttributes(
    accessToken: string,
    attributes: Record<string, string>
  ): Promise<void> {
    try {
      const client = new CognitoIdentityProviderClient({ region: this.region });

      // Convert attributes object to Cognito UserAttribute array
      const userAttributes = Object.entries(attributes).map(([Name, Value]) => ({
        Name,
        Value,
      }));

      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: userAttributes,
      });

      await client.send(command);
    } catch (error) {
      console.error("Error updating user attributes:", error);
      throw new Error("Không thể cập nhật thông tin người dùng");
    }
  }

  /**
   * Check if user has completed onboarding
   * @param attributes - User attributes object
   * @returns true if user has completed onboarding, false otherwise
   */
  hasCompletedOnboarding(attributes: Record<string, any>): boolean {
    // Check if user_type exists
    if (!attributes["custom:user_type"]) {
      return false;
    }

    // If user is a student, university is required
    if (attributes["custom:user_type"] === "sinh viên") {
      return !!attributes["custom:university"];
    }

    // For other user types, having user_type is enough
    return true;
  }

  /**
   * Check if user needs to complete onboarding
   * @param attributes - User attributes object
   * @returns true if user needs onboarding, false otherwise
   */
  needsOnboarding(attributes: Record<string, any>): boolean {
    return !this.hasCompletedOnboarding(attributes);
  }
}

export default new CognitoUserAttributesService();
