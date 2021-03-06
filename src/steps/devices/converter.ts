import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { HexnodeDevice } from '../../types';

import { Entities } from '../constants';

export function getDeviceKey(id: number): string {
  return `hexnode_device:${id.toString()}`;
}

export function createDeviceEntity(device: HexnodeDevice): Entity {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        _key: getDeviceKey(device.id),
        id: device.id.toString(),
        name: device.device_name,
        make: device.device_name,
        category: 'endpoint',
        model: device.model_name,
        deviceId: device.udid,
        osName: device.os_name,
        osVersion: device.os_version,
        enrolledTime: device.enrolled_time,
        lastReported: device.last_reported,
        compliant: device.compliant,
        serial: device.serial_number,
        enrollmentStatus: device.enrollment_status,
        userId: device.user.id,
        userName: device.user.name,
      },
    },
  });
}
