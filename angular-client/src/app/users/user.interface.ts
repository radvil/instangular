export interface UserDetail extends User {
  address?: UserAddress;
}

export interface UserAddress {
  street: string;
  city: string;
  country: string;
  postalCode: number;
}

export interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  password?: string;
  email?: string;
}