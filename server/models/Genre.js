import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        genreId: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "genreId" });
export const Genre = mongoose.model("genres", schema);
