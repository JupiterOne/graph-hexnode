export type HexnodeResponseMeta = {
  count: number;
  next: string;
  previous: string | null;
};

export type HexnodeUser = {
  id: number;
  name: string;
  email?: string;
  phoneno?: string;
  total_devices: number;
  domain: string;
};

export type HexnodeUserGroup = {
  id: number;
  groupname: string;
  description: string;
  users_count: number;
  modified_date: string;
};

export type HexnodeDevice = {
  id: number;
  device_name: string;
  model_name: string;
  os_name: string;
  os_version: string;
  enrolled_time: string;
  last_reported: string;
  compliant: boolean;
  serial_number: string;
  enrollment_status: string;
  udid: string;
  user: {
    id: number;
    name: string;
  };
};

export type HexnodeUserResponse = HexnodeResponseMeta & {
  results: HexnodeUser[];
};

export type HexnodeUserGroupResponse = HexnodeResponseMeta & {
  results: HexnodeUserGroup[];
};

export type HexnodeUserGroupDetail = {
  id: number;
  groupname: string;
  description: string;
  users: {
    id: number;
    name: string;
    email?: string;
    phoneno?: string;
  }[];
  detail?: string;
};

export type HexnodeDeviceGroup = {
  id: number;
  groupname: string;
  device_count: number;
  description: string;
  grouptype: string;
  modified_date: string;
};

export type HexnodeDeviceGroupDetail = {
  id: number;
  groupname: string;
  description: string;
  devices: {
    id: number;
    name: string;
    user_id: number;
    user_name: string;
    model_name: string;
    platform: string;
  }[];
};
