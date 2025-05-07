import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length, Min, ValidateIf } from "class-validator";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { availableAgentSorts, availableMemberSorts } from "../../config";
import { Direction } from "../../enums/common_enum";

@InputType()
export class MemberInput {
        @IsOptional()
        @Length(3, 12)
        @Field(() => String, { nullable: true })
        memberNick?: string;
      
        @IsNotEmpty()
        @Length(5, 12)
        @Field(() => String)
        memberPassword: string;
      
        @IsOptional()
        @Field(() => String, { nullable: true })
        memberPhone?: string;
      
        @IsOptional()
        @IsEmail()
        @Field(() => String, { nullable: true })
        memberEmail?: string;
      
        @IsOptional()
        @Field(() => MemberType, { nullable: true })
        memberType?: MemberType;
      
        @IsOptional()
        @Field(() => MemberAuthType, { nullable: true })
        memberAuthType?: MemberAuthType;
      }
      

      @InputType()
      export class LoginInput {
        @ValidateIf((o) => !o.memberEmail)
        @IsNotEmpty()
        @Length(3, 12)
        @Field(() => String, { nullable: true })
        memberNick?: string;
      
        @ValidateIf((o) => !o.memberNick)
        @IsNotEmpty()
        @IsEmail()
        @Length(5, 30)
        @Field(() => String, { nullable: true })
        memberEmail?: string;
      
        @IsNotEmpty()
        @Length(5, 12)
        @Field(() => String)
        memberPassword: string;
      }

@InputType()
class AISearch {
    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string
}

@InputType()
export class DealersInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableAgentSorts)
    @Field(() => String, { nullable: true })
    sort?: string

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction

    @IsNotEmpty()
    @Field(() => AISearch)
    search: AISearch;
}

@InputType()
class MISearch {
    @IsOptional()
    @Field(() => MemberStatus, { nullable: true })
    memberStatus?: MemberStatus

    @IsOptional()
    @Field(() => MemberType, { nullable: true })
    memberType?: MemberType

    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string
}

@InputType()
export class MembersInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableMemberSorts)
    @Field(() => String, { nullable: true })
    sort?: string

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction

    @IsNotEmpty()
    @Field(() => MISearch)
    search: MISearch;
}
