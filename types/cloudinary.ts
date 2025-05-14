export interface CloudinaryResource {
  height: number;
  width: number;
  public_id: string;
  secure_url: string;
  asset_id?: string;
  bytes: number;
  created_at: string;
  format: string;
  resource_type: string;
  tags: Array<string>;
}
