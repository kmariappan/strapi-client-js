import { StrapiUnifiedResponse } from './base';

export type ImageUnifiedResponse = StrapiUnifiedResponse<StrapiImage>;

export type StrapiImage = {
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: ImageProviderMetaData;
  createdAt: string;
  updatedAt: string;
};

type ImageFormatAttribute = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: ImageProviderMetaData;
};

type ImageProviderMetaData = {
  public_id: string;
  resource_type: string;
};

type ImageFormats = {
  large?: ImageFormatAttribute;
  small?: ImageFormatAttribute;
  medium?: ImageFormatAttribute;
  thumbnail?: ImageFormatAttribute;
};
