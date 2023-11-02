const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a name"],
      maxlength: [300, "Name cannot be more than 300 characters"]
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      default: 0
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [8000, "Description cannot be more than 8000 characters"]
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg"
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"]
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      enum: {
        values: ["marcos", "liddy", "ikea"],
        message: "{VALUE} is not supported"
      }
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    inventory: {
      type: Number,
      required: true,
      default: 15
    },
    averageRating: {
      type: Number,
      default: 0
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users"
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Reviews",
  localField: "_id",
  foreignField: "product",
  justOne: false
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Reviews").deleteMany({ product: this._id });
  next();
});

module.exports = mongoose.model("products", ProductSchema);
