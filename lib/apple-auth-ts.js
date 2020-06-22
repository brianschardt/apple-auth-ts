"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleAuth = void 0;
var axios_1 = require("axios");
var token_1 = require("./token");
var crypto = require("crypto");
var qs = require("querystring");
var AppleAuth = /** @class */ (function () {
    function AppleAuth(config, privateKey, privateKeyMethod) {
        if (typeof config == 'object') {
            if (Buffer.isBuffer(config)) {
                this._config = JSON.parse(config.toString());
            }
            else {
                this._config = config;
            }
        }
        else {
            this._config = JSON.parse(config);
        }
        this._state = "";
        this._tokenGenerator = new token_1.AppleClientSecret(this._config, privateKey, privateKeyMethod);
        this.loginURL = this.loginURL.bind(this);
    }
    Object.defineProperty(AppleAuth.prototype, "state", {
        /**
         * Return the state for the OAuth 2 process
         * @returns {string} state – The state bytes in hex format
         */
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Generates the Login URL
     * @returns {string} url – The Login URL
     */
    AppleAuth.prototype.loginURL = function () {
        this._state = crypto.randomBytes(5).toString('hex');
        var url = "https://appleid.apple.com/auth/authorize?"
            + "response_type=code%20id_token"
            + "&client_id=" + this._config.client_id
            + "&redirect_uri=" + this._config.redirect_uri
            + "&state=" + this._state
            + "&scope=" + this._config.scope
            + "&response_mode=form_post";
        return url;
    };
    /**
     * Get the access token from the server
     * based on the grant code
     * @param {string} code
     * @returns {Promise<object>} Access Token object
     */
    AppleAuth.prototype.accessToken = function (code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._tokenGenerator.generate().then(function (token) {
                var payload = {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: _this._config.redirect_uri,
                    client_id: _this._config.client_id,
                    client_secret: token,
                };
                axios_1.default({
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify(payload),
                    url: 'https://appleid.apple.com/auth/token'
                }).then(function (response) {
                    resolve(response.data);
                }).catch(function (response) {
                    reject("AppleAuth Error - An error occurred while getting response from Apple's servers: " + response);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Get the access token from the server
     * based on the refresh token
     * @param {string} refreshToken
     * @returns {object} Access Token object
     */
    AppleAuth.prototype.refreshToken = function (refreshToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._tokenGenerator.generate().then(function (token) {
                var payload = {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    redirect_uri: _this._config.redirect_uri,
                    client_id: _this._config.client_id,
                    client_secret: token,
                };
                axios_1.default({
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify(payload),
                    url: 'https://appleid.apple.com/auth/token'
                }).then(function (response) {
                    resolve(response.data);
                }).catch(function (err) {
                    reject("AppleAuth Error - An error occurred while getting response from Apple's servers: " + err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    return AppleAuth;
}());
exports.AppleAuth = AppleAuth;
