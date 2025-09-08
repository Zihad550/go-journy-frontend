import { RideStatus } from "@/constants";
import type { ObjectValues } from ".";
import type { IDriver } from "./driver.type";
import type { IUser } from "./user.type";

export interface ILocation {
  lat: string;
  lng: string;
}

export interface IRide {
  _id: string;
  user: string | IUser;
  driver?: string | IDriver;
  pickupLocation: ILocation;
  destination: ILocation;
  price: number;
  status: ObjectValues<typeof RideStatus>;
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
