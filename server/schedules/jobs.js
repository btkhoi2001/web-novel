import schedule from "node-schedule";
import { User } from "../models/User.js";

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.tz = "Etc/GMT-7";

function scheduler() {
    schedule.scheduleJob(rule, async () => {
        console.log("Update");
        await User.updateMany(
            { isVerified: true, isBlocked: false },
            { $inc: { flowers: 1 } }
        );
    });
}

export default scheduler;
