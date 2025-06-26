

import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({


    subscriber: {
        type: Schema.Types.ObjectId, // list of subscribers 
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // list of subscribers who subscribing 
        ref: "User"
    },

    
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)