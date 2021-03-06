export interface AppleAuthConfig {
    client_id: string;
    team_id: string;
    redirect_uri: string;
    key_id: string;
    scope: string;
}
export interface AppleAuthAccessToken {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    token_type: "bearer";
}
export interface AppleAuthError {
    error: "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type" | "invalid_scope";
}
