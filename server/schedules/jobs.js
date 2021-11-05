import schedule from "node-schedule";
import { User } from "../models/User.js";

const rule = new schedule.RecurrenceRule();
rule.hour = rule.minute = rule.second = 0;
rule.tz = "Etc/GMT-7";

function scheduler() {
    schedule.scheduleJob(rule, async () => {
        console.log("A new day has begun in the GMT-7 timezone");

        await User.updateMany(
            { isVerified: true, isBlocked: false },
            { $inc: { flowers: 1 } }
        );
    });
}

export default scheduler;
