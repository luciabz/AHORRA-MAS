export default class Token {
    /**
     * Token ID
     */
    jti: string;
    /**
     * Subject, id user
     */
    sub: number;
    /**
     * Audience, quien usara el token
     */
    aud: string;
    /**
     * Issuer, quien emite el token
     */
    iss: string;
    /**
     * Issued at, cuando fue emitido el token (timestamp)
     */
    iat: number;
    /**
     * Expiration, cuando expira el token (timestamp)
     */
    exp: number;


    constructor(jti: string, sub: number, aud: string, iss: string, iat: number, exp: number) {
        this.jti = jti;
        this.sub = sub;
        this.aud = aud;
        this.iss = iss;
        this.iat = iat;
        this.exp = exp;
    }

    toJSON() {
        return {
            jti: this.jti,
            sub: this.sub,
            aud: this.aud,
            iss: this.iss,
            iat: this.iat,
            exp: this.exp,
        };
    }

    static fromJSON(json: any): Token {
        return new Token(
            json.jti,
            json.sub,
            json.aud,
            json.iss,
            json.iat,
            json.exp
        );
    }
}