declare module "react-test-renderer" {
  import type { ReactElement } from "react";

  export interface ReactTestInstance {
    children: unknown[];
    props: Record<string, any>;
    findAllByType(type: string): ReactTestInstance[];
    findByProps(props: Record<string, unknown>): ReactTestInstance;
  }

  export interface ReactTestRenderer {
    root: ReactTestInstance;
  }

  export function act(callback: () => void | Promise<void>): void | Promise<void>;
  export function create(element: ReactElement): ReactTestRenderer;
}
