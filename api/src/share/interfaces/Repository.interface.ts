export default interface RepositoryInterface<T> {
    findById(id: number): Promise<T | null>;

    save(entity: T): Promise<T>;

    delete(entity: T): Promise<void>;
}