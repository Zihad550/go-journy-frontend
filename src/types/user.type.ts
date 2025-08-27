import type { Role, UserAccountStatus } from "@/constants";
import type { TGetUnionFromObj } from ".";
import type { IDriver } from "./driver.type";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: TGetUnionFromObj<typeof Role>;
  accountStatus: TGetUnionFromObj<typeof UserAccountStatus>;
  driver?: string | IDriver;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}
