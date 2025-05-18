import { registerEnumType } from '@nestjs/graphql';

// Luxury Watch Brands
export enum WatchBrand {
  ROLEX = 'ROLEX',
  OMEGA = 'OMEGA',
  IWC = 'IWC',
  LONGINES = 'LONGINES',
  PANERAI = 'PANERAI',
}
registerEnumType(WatchBrand, {
  name: 'WatchBrand',
});

export enum WatchGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}
registerEnumType(WatchGender, {
  name: 'WatchGender',
});

export enum WatchStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  DELETE = 'DELETE',
}
registerEnumType(WatchStatus, {
  name: 'WatchStatus',
});

export enum WatchCountry {
  UAE = "UAE",
  SWITZERLAND = "SWITZERLAND",
  JAPAN = "JAPAN",
  GERMANY = "GERMANY",
  FRANCE = "FRANCE",
  UNITED_KINGDOM = "UNITED_KINGDOM",
  ITALY = "ITALY",
  USA = "USA"
}

registerEnumType(WatchCountry, {
  name: 'WatchCountry',
});

export enum WatchMaterial {
  LEATHER = 'LEATHER',
  STEEL = 'STEEL',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
}

registerEnumType(WatchMaterial, {
  name: 'WatchMaterial',
});

export enum WatchCondition {
  NEW = 'NEW',
  SECONDHAND = 'SECONDHAND',
  REFURBISHED = 'REFURBISHED',
}
registerEnumType(WatchCondition, {
  name: 'WatchCondition',
});

export enum WatchMovement {
  QUARTZ = 'QUARTZ',
  AUTOMATIC = 'AUTOMATIC',
  MECHANICAL = 'MECHANICAL',
}
registerEnumType(WatchMovement, {
  name: 'WatchMovement',
});
