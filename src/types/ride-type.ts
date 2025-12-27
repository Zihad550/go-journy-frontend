import { RideStatus } from '@/constants';
import type { ObjectValues } from '.';
import type { IDriver } from './driver-type';
import type { IPayment } from './payment-type';
import type { IUser } from './user-type';

export interface ILocation {
  lat: string;
  lng: string;
}

export interface IRide {
  _id: string;
  rider: string | IUser;
  driver?: string | IDriver;
  interestedDrivers?: (string | IDriver)[];
  pickupLocation: ILocation;
  destination: ILocation;
  price: number;
  status: ObjectValues<typeof RideStatus>;
  payment?: IPayment;
  pickupTime?: Date;
  dropoffTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRideRequest {
  pickupLocation: ILocation;
  destination: ILocation;
  price: number;
}

export interface IRideStatusUpdate {
  status: ObjectValues<typeof RideStatus>;
}

export interface IRideFilters {
  minPrice?: number;
  maxPrice?: number;
  riderName?: string;
  pickupLat?: string;
  pickupLng?: string;
  pickupRadius?: number;
  destLat?: string;
  destLng?: string;
  destRadius?: number;
}
