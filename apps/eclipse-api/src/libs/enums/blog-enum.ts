import { registerEnumType } from '@nestjs/graphql';

export enum BlogCategory {
	GENERAL = 'GENERAL',
	INSTRUCTIVE = 'INSTRUCTIVE',
	LIFESTYLE = 'LIFESTYLE',
}
registerEnumType(BlogCategory, {
	name: 'BlogCategory',
});

export enum BlogStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(BlogStatus, {
	name: 'BlogStatus',
});
