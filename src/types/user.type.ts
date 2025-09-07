import type { Role, UserAccountStatus } from "@/constants";
import type { ObjectValues } from ".";
import type { IDriver } from "./driver.type";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: ObjectValues<typeof Role>;
  accountStatus: ObjectValues<typeof UserAccountStatus>;
  driver?: string | IDriver;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}
