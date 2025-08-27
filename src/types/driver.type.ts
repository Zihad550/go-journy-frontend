import type { DriverAvailability, DriverStatus } from "@/constants";
import type { TGetUnionFromObj } from ".";
import type { IUser } from "./user.type";

export interface IDriver {
  _id: string;
  user: string | IUser;
  availability: TGetUnionFromObj<typeof DriverAvailability>;
  driverStatus: TGetUnionFromObj<typeof DriverStatus>;
  vehicle: IVehicle;
  experience: number; // in year
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicle {
  name: string;
  model: string;
  seatCount: number;
}
