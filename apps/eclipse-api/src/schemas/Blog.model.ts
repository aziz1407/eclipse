import { Schema } from 'mongoose';
import { BlogCategory, BlogStatus } from '../libs/enums/blog-enum';

const BlogSchema = new Schema(
	{
		blogCategory: {
			type: String,
			enum: BlogCategory,
			required: true,
		},

		blogStatus: {
			type: String,
			enum: BlogStatus,
			default: BlogStatus.ACTIVE,
		},

		blogTitle: {
			type: String,
			required: true,
		},

		blogContent: {
			type: String,
			required: true,
		},

		blogImage: {
			type: String,
		},

		blogLikes: {
			type: Number,
			default: 0,
		},

		blogViews: {
			type: Number,
			default: 0,
		},

		blogComments: {
			type: Number,
			default: 0,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'blogs' }, // optionally change collection name too
);

export default BlogSchema;
