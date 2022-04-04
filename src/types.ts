export interface HexnodeUser {
  id: number;
  name: string;
  email?: string;
  phoneno?: string;
  total_devices: number;
  domain: string;
}

export interface HexnodeUserResponse {
  count: number;
  next: string;
  previous: string | null;
  results: HexnodeUser[];
}
