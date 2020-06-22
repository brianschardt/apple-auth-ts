import * as jwt from 'jsonwebtoken';
import { AppleAuthConfig } from './type';
export declare class AppleClientSecret {
    _config: AppleAuthConfig;
    _privateKeyLocation: any;
    _privateKeyMethod: string;
    _privateKey: any;
    constructor(config: AppleAuthConfig, privateKeyLocation: any, privateKeyMethod: string);
    _generateToken(clientId: any, teamId: any, privateKey: jwt.Secret, exp: number, keyid: any): Promise<unknown>;
    /**
     * Reads the private key file calls
     * the token generation method
     * @returns {Promise<string>} token - The generated client secret
     */
    generate(): Promise<unknown>;
}
