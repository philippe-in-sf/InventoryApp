declare module "expo-image-picker" {
  export interface PermissionResponse {
    granted: boolean;
  }

  export interface ImagePickerAsset {
    uri?: string;
  }

  export type ImagePickerResult =
    | { canceled: true; assets?: ImagePickerAsset[] }
    | { canceled: false; assets: ImagePickerAsset[] };

  export function requestCameraPermissionsAsync(): Promise<PermissionResponse>;
  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function launchCameraAsync(options?: Record<string, unknown>): Promise<ImagePickerResult>;
  export function launchImageLibraryAsync(options?: Record<string, unknown>): Promise<ImagePickerResult>;
}
