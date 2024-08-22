export interface Child {
    isVis?: { bind: (value: string) => any };
    isVisible?: boolean;
    boxClass?: string;
    component: any;
    props: any;
}
