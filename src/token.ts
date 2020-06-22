import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { AppleAuthConfig } from './type';

export class AppleClientSecret {
  _config: AppleAuthConfig;
  _privateKeyLocation: any;
  _privateKeyMethod: string;
  _privateKey: any;
  constructor(config: AppleAuthConfig, privateKeyLocation: any, privateKeyMethod: string) {
    this._config = config;
    this._privateKeyLocation = privateKeyLocation;
    if (typeof privateKeyMethod == 'undefined') {
      this._privateKeyMethod = 'file';
    } else if (privateKeyMethod == 'text' || privateKeyMethod == 'file') {
      this._privateKeyMethod = privateKeyMethod;
    } else {
      this._privateKeyMethod = privateKeyMethod;
    }
    this.generate = this.generate.bind(this);
    this._generateToken = this._generateToken.bind(this);
  }

  _generateToken(clientId: any, teamId: any, privateKey: jwt.Secret, exp: number, keyid: any) {
    return new Promise(
      (resolve, reject) => {
        // Curate the claims
        const claims = {
          iss: teamId,
          iat: Math.floor(Date.now() / 1000),
          exp,
          aud: 'https://appleid.apple.com',
          sub: clientId,
        };
        // Sign the claims using the private key
        jwt.sign(claims, privateKey, {
          algorithm: 'ES256',
          keyid
        }, (err, token) => {
          if (err) {
            reject("AppleAuth Error – Error occurred while signing: " + err);
            return;
          }
          resolve(token);
        });
      }
    );
  }

  /**
   * Reads the private key file calls 
   * the token generation method
   * @returns {Promise<string>} token - The generated client secret
   */
  generate() {
    return new Promise(
      (resolve, reject) => {
        var that = this;
        function generateToken() {
          let exp = Math.floor(Date.now() / 1000) + (86400 * 180); // Make it expire within 6 months
          that._generateToken(
            that._config.client_id,
            that._config.team_id,
            that._privateKey,
            exp,
            that._config.key_id
          ).then((token) => {
            resolve(token);
          }).catch((err) => {
            reject(err);
          });
        }
        if (!that._privateKey) {
          if (that._privateKeyMethod == 'file') {
            fs.readFile(that._privateKeyLocation, (err, privateKey) => {
              if (err) {
                reject("AppleAuth Error - Couldn't read your Private Key file: " + err);
                return;
              }
              that._privateKey = privateKey;
              generateToken();
            });
          } else {
            that._privateKey = that._privateKeyLocation;
            process.nextTick(generateToken);
          }
        } else {
          process.nextTick(generateToken);
        }
      }
    );
  }
}
