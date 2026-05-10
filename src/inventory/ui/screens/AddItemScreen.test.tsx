import type { ReactTestRenderer, ReactTestInstance } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import { AddItemScreen } from "./AddItemScreen";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      palette: {
        background: "#f6f3ee",
        surface: "#fffdf9",
        surfaceAlt: "#ece7df",
        ink: "#1f2623",
        muted: "#68736d",
        faint: "#8f9791",
        line: "#ded7cc",
        primary: "#215c58",
        primaryDark: "#173f3c",
        accent: "#c8774a",
        accentSoft: "#f3dfd1",
        greenSoft: "#dce9df",
        blueSoft: "#dce5ec",
        goldSoft: "#f2e4bf",
        danger: "#9f3d32",
        heroText: "#fffdf9",
        heroMuted: "#d8e2df",
      },
    },
    themeId: "estate-ledger",
    setThemeId: vi.fn(),
  }),
}));

vi.mock("react-native", async () => {
  const React = await import("react");

  return {
    View: ({ children, ...props }: { children?: React.ReactNode }) => React.createElement("View", props, children),
    Text: ({ children, ...props }: { children?: React.ReactNode }) => React.createElement("Text", props, children),
    Image: (props: Record<string, unknown>) => React.createElement("Image", props),
    ScrollView: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement("ScrollView", props, children),
    TextInput: (props: Record<string, unknown>) => React.createElement("TextInput", props),
    Pressable: ({ children, onPress, ...props }: { children?: React.ReactNode; onPress(): void }) =>
      React.createElement("Pressable", { ...props, onPress }, children),
    Button: ({ title, onPress }: { title: string; onPress(): void }) =>
      React.createElement("Button", { title, onPress }, title),
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
    },
  };
});

describe("AddItemScreen", () => {
  it("saves a manual item", async () => {
    const onSave = vi.fn();
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(<AddItemScreen onSave={onSave} lookup={async () => ({ status: "not_found" })} />);
    });

    const nameInput = renderer!.root.findByProps({ accessibilityLabel: "Name" });
    act(() => {
      nameInput.props.onChangeText("Desk lamp");
    });

    const saveButton = renderer!.root.findByProps({ accessibilityLabel: "Save item" });
    await act(async () => {
      await saveButton.props.onPress();
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

    const barcodeInput = renderer!.root.findByProps({ accessibilityLabel: "Barcode or ISBN" });
    act(() => {
      barcodeInput.props.onChangeText("012345678905");
    });

    const lookupButton = renderer!.root.findByProps({ accessibilityLabel: "Look up code" });
    await act(async () => {
      await lookupButton.props.onPress();
    });

    const message = renderer!.root.findAllByType("Text").find((node: ReactTestInstance) => {
      return node.children.includes("No match found. The code is saved for manual entry.");
    });

    expect(message).toBeTruthy();
  });

  it("saves stock photos returned from lookup", async () => {
    const onSave = vi.fn();
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(
        <AddItemScreen
          onSave={onSave}
          lookup={async () => ({
            status: "found",
            confidence: "high",
            source: "Open Library",
            fields: {
              name: "Dune",
              categoryId: "books",
              photos: ["https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg?default=false"],
            },
          })}
        />,
      );
    });

    const barcodeInput = renderer!.root.findByProps({ accessibilityLabel: "Barcode or ISBN" });
    act(() => {
      barcodeInput.props.onChangeText("9780441172719");
    });

    const lookupButton = renderer!.root.findByProps({ accessibilityLabel: "Look up code" });
    await act(async () => {
      await lookupButton.props.onPress();
    });

    const saveButton = renderer!.root.findByProps({ accessibilityLabel: "Save item" });
    await act(async () => {
      await saveButton.props.onPress();
    });

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: "books",
        name: "Dune",
        photos: ["https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg?default=false"],
      }),
    );
  });
});
