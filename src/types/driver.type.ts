import type { DriverAvailability, DriverStatus } from '@/constants';
import type { ObjectValues } from '.';
import type { IUser } from './user.type';

export interface IDriver {
  _id: string;
  user: string | IUser;
  availability: ObjectValues<typeof DriverAvailability>;
  driverStatus: ObjectValues<typeof DriverStatus>;
  vehicle: IVehicle;
  experience: number; // in year
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicle {
  name: string;
  model: string;
}
export interface IDriverEarnings {
  _id: string | null;
  earnings: number;
}
