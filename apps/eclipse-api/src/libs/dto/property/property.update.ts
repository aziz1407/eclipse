import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { WatchCountry, WatchCondition, WatchBrand, WatchStatus } from '../../enums/property.enum';


@InputType()
export class PropertyUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(() => WatchBrand, { nullable: true })
    propertyBrand?: WatchBrand;

    @IsOptional()
    @Field(() => WatchStatus, { nullable: true })
    propertyStatus?: WatchStatus;

    @IsOptional()
    @Field(() => WatchCountry, { nullable: true })
    propertyLocation?: WatchCountry;

    @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true })
    propertyAddress?: string;

    @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true })
    propertyTitle?: string;

    @IsOptional()
    @Field(() => Number, { nullable: true })
    propertyPrice?: number;

    @IsOptional()
    @Field(() => Number, { nullable: true })
    propertySquare?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Field(() => Int, { nullable: true })
    propertyBeds?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Field(() => Int, { nullable: true })
    propertyRooms?: number;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    propertyImages?: string[];

    @IsOptional()
    @Length(5, 500)
    @Field(() => String, { nullable: true })
    propertyDesc?: string;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyBarter?: boolean;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyRent?: boolean;

    soldAt?: Date;

    deletedAt?: Date;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    constructedAt?: Date;
}
