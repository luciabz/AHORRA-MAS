import Token from "../../../token/domain/Token";

export interface JwtProviderInterface {
    sign(userId: number): string;

    verify(token: string): Token | null
}