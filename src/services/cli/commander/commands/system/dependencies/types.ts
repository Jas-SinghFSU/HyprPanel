export type DependencyType = 'executable' | 'library' | 'service';

export type Dependency = {
    package: string;
    required: boolean;
    type: DependencyType;
    check: string[];
    description?: string;
};
