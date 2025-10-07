import {sign, verify} from "jsonwebtoken";
import {JwtProviderInterface} from "../../user/domain/interface/JwtProvider.interface";
import Token from "../domain/Token";
import {randomUUID} from "node:crypto";

export default class JwtProvider implements JwtProviderInterface {
    private readonly secret: string
    /**
     * Tiempo de expiración en segundos
     * @private
     */
    private readonly expiresIn: number

    constructor(secret: string, expiresIn: number) {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    sign(userId: number): string {
        const now = new Date();

        const token = new Token(
            randomUUID(),
            userId,
            "ahorraPlus",
            "ahorraPlus",
            now.getTime() / 1000,
            new Date(now.getTime() + this.expiresIn * 1000).getTime() / 1000,
        )

        return sign(token.toJSON(), this.secret);
    }

    verify(token: string): Token | null {
        try {
            const decoded = verify(token, this.secret) as unknown as Token;

            const tokenEntity = Token.fromJSON(decoded);

            if (tokenEntity.iss !== "ahorraPlus" || tokenEntity.aud !== "ahorraPlus") return null;

            return tokenEntity;
        } catch {
            return null
        }
    }
}