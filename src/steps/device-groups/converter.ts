import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { HexnodeDeviceGroup } from '../../types';

import { Entities } from '../constants';

export function createDeviceGroupEntity(
  deviceGroup: HexnodeDeviceGroup,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: deviceGroup,
      assign: {
        _type: Entities.DEVICE_GROUP._type,
        _class: Entities.DEVICE_GROUP._class,
        _key: `${deviceGroup.groupname}-${deviceGroup.id.toString()}`,
        id: deviceGroup.id.toString(),
        name: deviceGroup.groupname,
        groupName: deviceGroup.groupname,
        description: deviceGroup.description,
        deviceCount: deviceGroup.device_count,
        modifiedDate: deviceGroup.modified_date,
      },
    },
  });
}
