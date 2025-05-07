import { Schema } from 'mongoose';
import { WatchBrand, WatchCondition, WatchCountry, WatchGender, WatchMaterial, WatchStatus } from '../libs/enums/property.enum';

const PropertySchema = new Schema(
	{
		propertyBrand: {
			type: String,
			enum: WatchBrand,
			required: true,
		},

		propertyStatus: {
			type: String,
			enum: WatchStatus,
			default: WatchStatus.AVAILABLE,
		},

		propertyCountry: {
			type: String,
			enum: WatchCountry,
			required: true,
		},

		propertyModel: {
			type: String,
			required: true,
		},

		propertyCategory: {
			type: String,
			enum: WatchGender,
			required: true,
		},

		propertyMaterial: {
			type: String,
			enum: WatchMaterial,
			required: true
		},

		propertyAddress: {
			type: String,
			required: true,
		},

		propertyPrice: {
			type: Number,
			required: true,
		},

		propertyCondition: {
			type: String,
			enum: WatchCondition,
			required: true,
		},

		propertyViews: {
			type: Number,
			default: 0,
		},

		propertyLikes: {
			type: Number,
			default: 0,
		},

		propertyComments: {
			type: Number,
			default: 0,
		},

		propertyRank: {
			type: Number,
			default: 0,
		},

		propertyImages: {
			type: [String],
			required: true,
		},

		propertyDesc: {
			type: String,
		},

		propertyBarter: {
			type: Boolean,
			default: false,
		},

		propertyRent: {
			type: Boolean,
			default: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		constructedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'watches' },
);

PropertySchema.index({ propertyBrand: 1, propertyCountry: 1, propertyModel: 1, propertyPrice: 1 }, { unique: true });

export default PropertySchema;
