const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      cloudinaryImageId: { type: "string" },
      locality: { type: "string" },
      areaName: { type: "string" },
      costForTwo: { type: "string" },
      cuisines: {
        type: "array",
        items: { type: "string" },
      },
      avgRating: { type: "number" },
      veg: { type: "boolean" },
      feeDetails: {
        type: "object",
        properties: {
          restaurantId: { type: "string" },
          fees: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                fee: { type: "number" },
              },
            },
          },
          totalFee: { type: "number" },
        },
      },
      parentId: { type: "string" },
      avgRatingString: { type: "string" },
      totalRatingsString: { type: "string" },
      sla: {
        type: "object",
        properties: {
          deliveryTime: { type: "number" },
          serviceability: { type: "string" },
          slaString: { type: "string" },
          iconType: { type: "string" },
        },
      },
      availability: {
        type: "object",
        properties: {
          nextCloseTime: { type: "string" },
          opened: { type: "boolean" },
        },
      },
      badges: { type: "object" },
      isOpen: { type: "boolean" },
      type: { type: "string" },
      badgesV2: {
        type: "object",
        properties: {
          entityBadges: {
            type: "object",
            properties: {
              imageBased: { type: "object" },
              textBased: { type: "object" },
              textExtendedBadges: { type: "object" },
            },
          },
        },
      },
      aggregatedDiscountInfoV3: {
        type: "object",
        properties: {
          header: { type: "string" },
          subHeader: { type: "string" },
          discountTag: { type: "string" },
        },
      },
      orderabilityCommunication: {
        type: "object",
        properties: {
          title: { type: "object" },
          subTitle: { type: "object" },
          message: { type: "object" },
          customIcon: { type: "object" },
        },
      },
      differentiatedUi: {
        type: "object",
        properties: {
          displayType: { type: "string" },
          differentiatedUiMediaDetails: {
            type: "object",
            properties: {
              mediaType: { type: "string" },
              lottie: { type: "object" },
              video: { type: "object" },
            },
          },
        },
      },
      reviewsSummary: { type: "object" },
      displayType: { type: "string" },
      restaurantOfferPresentationInfo: { type: "object" },
    },
  },
  { timestamps: true } // Include timestamps
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
