import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	BLOG = 'BLOG',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
