import type { ReactTestRenderer } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import { AddItemScreen } from "./AddItemScreen";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("react-native", async () => {
  const React = await import("react");

  return {
    View: ({ children, ...props }: { children?: React.ReactNode }) => React.createElement("View", props, children),
    Text: ({ children, ...props }: { children?: React.ReactNode }) => React.createElement("Text", props, children),
    TextInput: (props: Record<string, unknown>) => React.createElement("TextInput", props),
    Button: ({ title, onPress }: { title: string; onPress(): void }) =>
      React.createElement("Button", { title, onPress }, title),
  };
});

describe("AddItemScreen", () => {
  it("saves a manual item", () => {
    const onSave = vi.fn();
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(<AddItemScreen onSave={onSave} lookup={async () => ({ status: "not_found" })} />);
    });

    const nameInput = renderer!.root.findByProps({ accessibilityLabel: "Name" });
    act(() => {
      nameInput.props.onChangeText("Desk lamp");
    });

    const saveButton = renderer!.root.findByProps({ title: "Save item" });
    act(() => {
      saveButton.props.onPress();
    });

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: "Desk lamp" }));
  });

  it("keeps scanned code when lookup fails", async () => {
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(
        <AddItemScreen
          onSave={vi.fn()}
          lookup={async () => ({ status: "not_found", scannedCode: "012345678905" })}
        />,
      );
    });

    const barcodeInput = renderer!.root.findByProps({ accessibilityLabel: "Barcode" });
    act(() => {
      barcodeInput.props.onChangeText("012345678905");
    });

    const lookupButton = renderer!.root.findByProps({ title: "Look up" });
    await act(async () => {
      await lookupButton.props.onPress();
    });

    const message = renderer!.root.findAllByType("Text").find((node) => {
      return node.children.includes("No match found. The code is saved for manual entry.");
    });

    expect(message).toBeTruthy();
  });
});
