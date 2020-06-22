"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleClientSecret = void 0;
var jwt = require("jsonwebtoken");
var fs = require("fs");
var AppleClientSecret = /** @class */ (function () {
    function AppleClientSecret(config, privateKeyLocation, privateKeyMethod) {
        this._config = config;
        this._privateKeyLocation = privateKeyLocation;
        if (typeof privateKeyMethod == 'undefined') {
            this._privateKeyMethod = 'file';
        }
        else if (privateKeyMethod == 'text' || privateKeyMethod == 'file') {
            this._privateKeyMethod = privateKeyMethod;
        }
        else {
            this._privateKeyMethod = privateKeyMethod;
        }
        this.generate = this.generate.bind(this);
        this._generateToken = this._generateToken.bind(this);
    }
    AppleClientSecret.prototype._generateToken = function (clientId, teamId, privateKey, exp, keyid) {
        return new Promise(function (resolve, reject) {
            // Curate the claims
            var claims = {
                iss: teamId,
                iat: Math.floor(Date.now() / 1000),
                exp: exp,
                aud: 'https://appleid.apple.com',
                sub: clientId,
            };
            // Sign the claims using the private key
            jwt.sign(claims, privateKey, {
                algorithm: 'ES256',
                keyid: keyid
            }, function (err, token) {
                if (err) {
                    reject("AppleAuth Error – Error occurred while signing: " + err);
                    return;
                }
                resolve(token);
            });
        });
    };
    /**
     * Reads the private key file calls
     * the token generation method
     * @returns {Promise<string>} token - The generated client secret
     */
    AppleClientSecret.prototype.generate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var that = _this;
            function generateToken() {
                var exp = Math.floor(Date.now() / 1000) + (86400 * 180); // Make it expire within 6 months
                that._generateToken(that._config.client_id, that._config.team_id, that._privateKey, exp, that._config.key_id).then(function (token) {
                    resolve(token);
                }).catch(function (err) {
                    reject(err);
                });
            }
            if (!that._privateKey) {
                if (that._privateKeyMethod == 'file') {
                    fs.readFile(that._privateKeyLocation, function (err, privateKey) {
                        if (err) {
                            reject("AppleAuth Error - Couldn't read your Private Key file: " + err);
                            return;
                        }
                        that._privateKey = privateKey;
                        generateToken();
                    });
                }
                else {
                    that._privateKey = that._privateKeyLocation;
                    process.nextTick(generateToken);
                }
            }
            else {
                process.nextTick(generateToken);
            }
        });
    };
    return AppleClientSecret;
}());
exports.AppleClientSecret = AppleClientSecret;
