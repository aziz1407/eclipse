import { registerEnumType } from '@nestjs/graphql';

// Luxury Watch Brands
export enum WatchBrand {
  ROLEX = 'ROLEX',
  OMEGA = 'OMEGA',
  JACOB_AND_CO = 'JACOB_AND_CO',
  TAG_HEUER = 'TAG_HEUER',
  TISSOT = "TISSOT"
}
registerEnumType(WatchBrand, {
  name: 'WatchBrand',
});

export enum WatchGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = "UNISEX"
}
registerEnumType(WatchGender, {
  name: 'WatchGender',
});

export enum WatchStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  DELETED = 'DELETED',
}
registerEnumType(WatchStatus, {
  name: 'WatchStatus',
});

export enum WatchCountry {
  SWITZERLAND = 'SWITZERLAND',
  JAPAN = 'JAPAN',
  GERMANY = 'GERMANY',
  USA = 'USA',
  FRANCE = 'FRANCE',
  ITALY = 'ITALY',
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
  BRAND_NEW = 'BRAND_NEW',
  SECONDHAND = 'SECONDHAND',
  REFURBISHED = 'REFURBISHED',
}
registerEnumType(WatchCondition, {
  name: 'WatchCondition',
});
