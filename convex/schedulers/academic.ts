/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { internalAction } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { v } from "convex/values";

export const checkTermProgression = internalAction({
  args: {
    configId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.runQuery(api.queries.academic.getAcademicConfig, {
      configId: args.configId,
    });

    if (!config?.autoTermProgression || !config?.currentTerm) {
      return;
    }

    const now = new Date();
    const termEndDate = new Date(
      config.currentTerm.endDate as string | number | Date,
    );

    if (now >= termEndDate) {
      // Progress to next term
      await ctx.runMutation(api.mutations.academic.progressToNextTerm, {
        configId: args.configId,
      });
    } else {
      // Schedule next check at term end date
      const checkDate = new Date(termEndDate);
      checkDate.setHours(0, 0, 0, 0);

      await ctx.scheduler.runAt(
        checkDate,
        internal.schedulers.academic.checkTermProgression,
        {
          configId: args.configId,
        },
      );
    }
  },
});
