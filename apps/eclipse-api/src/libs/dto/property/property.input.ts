import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min, IsInt, IsIn } from 'class-validator';
import { WatchCountry, WatchCondition, WatchBrand, WatchStatus, WatchGender, WatchMaterial, WatchMovement } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availablePropertySorts } from '../../config';
import { Direction } from '../../enums/common_enum';

@InputType()
export class PropertyInput {
    @IsNotEmpty()
    @Field(() => WatchBrand)
    propertyBrand: WatchBrand;

    @IsNotEmpty()
    @Field(() => WatchCountry)
    propertyCountry: WatchCountry;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    propertyModel: string;

    @IsNotEmpty()
    @Field(() => WatchGender)
    propertyCategory: WatchGender;

    @IsNotEmpty()
    @Field(() => WatchMaterial)
    propertyMaterial: WatchMaterial

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    propertyAddress: string;

    @IsNotEmpty()
    @Field(() => Number)
    propertyPrice: number;

    @IsNotEmpty()
    @Field(() => Number)
    propertyYear: number;

    @IsNotEmpty()
    @Field(() => WatchCondition)
    propertyCondition: WatchCondition;

    @IsOptional()
    @Field(() => WatchMovement, { nullable: true })
    propertyMovement?: WatchMovement;

    @IsNotEmpty()
    @Field(() => [String])
    propertyImages: string[];

    @IsOptional()
    @Length(5, 500)
    @Field(() => String, { nullable: true })
    propertyDesc?: string;

    memberId?: ObjectId;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    constructedAt?: Date;
}

@InputType()
export class PricesRange {
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
class PISearch {
    @IsOptional()
    @Field(() => String, { nullable: true })
    memberId?: ObjectId;

    @IsOptional()
    @Field(() => [WatchCountry], { nullable: true })
    locationList?: WatchCountry[];

    @IsOptional()
    @Field(() => [WatchBrand], { nullable: true })
    typeList?: WatchBrand[];

    @IsOptional()
    @Field(() => [WatchGender], { nullable: true })
    propertyCategory?: WatchGender[];

    @IsOptional()
    @Field(() => [WatchMaterial], { nullable: true })
    propertyMaterial?: WatchMaterial[];

    @IsOptional()
    @Field(() => [WatchCondition], { nullable: true })
    propertyCondition?: WatchCondition[];

    @IsOptional()
    @Field(() => [WatchMovement], { nullable: true })
    propertyMovement?: WatchMovement[];

    @IsOptional()
    @IsIn(availableOptions, { each: true })
    @Field(() => [String], { nullable: true })
    options?: string[];

    @IsOptional()
    @Field(() => PricesRange, { nullable: true })
    pricesRange?: PricesRange;

    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string;
}

@InputType()
export class PropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => PISearch)
    search: PISearch;
}

@InputType()
class APISearch {
    @IsOptional()
    @Field(() => WatchStatus, { nullable: true })
    propertyStatus?: WatchStatus;
}

@InputType()
export class AgentPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => APISearch)
    search: APISearch;
}

@InputType()
class ALPISearch {
    @IsOptional()
    @Field(() => WatchStatus, { nullable: true })
    propertyStatus?: WatchStatus;

    @IsOptional()
    @Field(() => [WatchCountry], { nullable: true })
    propertyLocationList?: WatchCountry[];
}

@InputType()
export class AllPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => ALPISearch)
    search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;
}
