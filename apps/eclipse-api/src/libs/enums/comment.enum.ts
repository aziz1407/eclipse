import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(CommentStatus, {
	name: 'CommentStatus',
});

export enum CommentGroup {
	MEMBER = 'MEMBER',
	BLOG = 'BLOG',
	WATCH = 'WATCH',
}
registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
