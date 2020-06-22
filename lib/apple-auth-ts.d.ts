import { AppleClientSecret } from './token';
import { AppleAuthConfig } from './type';
export declare class AppleAuth {
    /**
     * Configure the parameters of the Apple Auth class
     * @param {object} config - Configuration options
     * @param {string} config.client_id – Client ID (also known as the Services ID
     *  in Apple's Developer Portal). Example: com.ananayarora.app
     * @param {string} config.team_id – Team ID for the Apple Developer Account
     *  found on top right corner of the developers page
     * @param {string} config.redirect_uri – The OAuth Redirect URI
     * @param {string} config.key_id – The identifier for the private key on the Apple
     * @param {string} config.scope - the scope of information you want to get from the user (user name and email)
     *  Developer Account page
     * @param {string} privateKeyLocation - Private Key Location / the key itself
     * @param {string} privateKeyMethod - Private Key Method (can be either 'file' or 'text')
     */
    _config: AppleAuthConfig;
    _state: any;
    _tokenGenerator: AppleClientSecret;
    constructor(config: AppleAuthConfig, privateKey: any, privateKeyMethod: any);
    /**
     * Return the state for the OAuth 2 process
     * @returns {string} state – The state bytes in hex format
     */
    get state(): any;
    /**
     * Generates the Login URL
     * @returns {string} url – The Login URL
     */
    loginURL(): string;
    /**
     * Get the access token from the server
     * based on the grant code
     * @param {string} code
     * @returns {Promise<object>} Access Token object
     */
    accessToken(code: string): Promise<unknown>;
    /**
     * Get the access token from the server
     * based on the refresh token
     * @param {string} refreshToken
     * @returns {object} Access Token object
     */
    refreshToken(refreshToken: string): Promise<unknown>;
}
