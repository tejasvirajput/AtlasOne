// // backend/model/itinerary.model.js
// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const dayPlanSchema = new Schema({
//   day: Number,
//   content: String,
// });

// const itinerarySchema = new Schema(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     destination: { type: String, required: true },
//     days: { type: Number, required: true, min: 1, max: 30 },
//     budget: { type: String, enum: ["Low", "Mid", "Luxury"], required: true },
//     interests: [{ type: String }],
//     rawText: { type: String, required: true },
//     dayWise: [dayPlanSchema],
//   },
//   { timestamps: true }
// );

// const Itinerary = mongoose.model("Itinerary", itinerarySchema);
// export default Itinerary;

// models/itinerary.model.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const dayPlanSchema = new Schema({
  day: Number,
  content: String,
});

const itinerarySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    days: { type: Number, required: true, min: 1, max: 30 },

    // ⭐ UPDATED HERE — removed enum
    budget: { type: String, required: true },

    interests: [{ type: String }],
    rawText: { type: String, required: true },
    dayWise: [dayPlanSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
