import schedule from "node-schedule";
import { User } from "../models/User.js";
import { NovelCounter } from "../models/NovelCounter.js";

const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = dailyRule.minute = dailyRule.second = 0;
dailyRule.tz = "Etc/GMT-7";

const weeklyRule = new schedule.RecurrenceRule();
weeklyRule.hour = weeklyRule.minute = weeklyRule.second = 0;
weeklyRule.tz = "Etc/GMT-7";
weeklyRule.dayOfWeek = 1;

const monthlyRule = new schedule.RecurrenceRule();
monthlyRule.hour = monthlyRule.minute = monthlyRule.second = 0;
monthlyRule.tz = "Etc/GMT-7";
monthlyRule.date = 1;

function scheduler() {
    schedule.scheduleJob(dailyRule, async () => {
        await User.updateMany(
            { isVerified: true, isBlocked: false },
            { $inc: { flowers: 1 } }
        );

        await NovelCounter.updateMany({}, { daily: 0 });
    });

    schedule.scheduleJob(weeklyRule, async () => {
        await NovelCounter.updateMany({}, { weekly: 0 });
    });

    schedule.scheduleJob(monthlyRule, async () => {
        await NovelCounter.updateMany({}, { monthly: 0 });
    });
}

export default scheduler;
