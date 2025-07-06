interface ProjectOptions {
    template: string;
    force: boolean;
}
export declare function createProject(projectName: string, options: ProjectOptions): Promise<void>;
export {};
