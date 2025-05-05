import { registerEnumType } from '@nestjs/graphql';

// Luxury Watch Brands
export enum WatchBrand {
  ROLEX = 'ROLEX',
  OMEGA = 'OMEGA',
  PATEK_PHILIPPE = 'PATEK_PHILIPPE',
  AUDEMARS_PIGUET = 'AUDEMARS_PIGUET',
  JACOB_AND_CO = 'JACOB_AND_CO',
  TAG_HEUER = 'TAG_HEUER',
}
registerEnumType(WatchBrand, {
  name: 'WatchBrand',
});

export enum WatchStatus {
  AVAILABLE = 'AVAILABLE',
//   RESERVED = 'RESERVED',
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

export enum WatchCondition {
  BRAND_NEW = 'BRAND_NEW',
  SECONDHAND = 'SECONDHAND',
  REFURBISHED = 'REFURBISHED',
}
registerEnumType(WatchCondition, {
  name: 'WatchCondition',
});
