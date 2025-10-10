export type InteractorEntity<T> = T | Promise<T>;

export interface Interactor<T> {
    readonly entity: InteractorEntity<T>;

    finalize(): Promise<T>;
}
