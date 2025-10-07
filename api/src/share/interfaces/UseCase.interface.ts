export interface UseCaseInterface {
    execute(...params: any[]): Promise<any>;
}