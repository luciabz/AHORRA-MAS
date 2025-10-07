export interface HashProviderInterface {
    hash(payload: string): Promise<string>;

    compare(payload: string, hashed: string): Promise<boolean>;
}