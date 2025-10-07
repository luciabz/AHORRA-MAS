export default interface ApplicationModule {
    /**
     * Starts the application module.
     * This method should be called to start the module's operations.
     */
    start(): void | Promise<void>;

    /**
     * Stops the application module.
     * This method should be called to stop the module's operations.
     */
    stop(): void | Promise<void>;
}
