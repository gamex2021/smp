/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from "convex/values";

import {
    internalQuery,
    query
} from "../_generated/server";

// get an announcement by its id
export const getAnnouncement = internalQuery({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// get all announcements for a school
export const getAnnouncementsWithPagination = query({
  args: {
    search: v.optional(v.string()),
    schoolId: v.optional(v.id("schools")),
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { cursor, numItems, schoolId } = args;

    if (!schoolId) {
      return { announcements: [], continueCursor: null };
    }

    let query = ctx.db
      .query("announcements")
      .withIndex("by_school_id", (q) => q.eq("schoolId", schoolId));

    if (args.search) {
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("title"), args.search!),
          q.eq(q.field("content"), args.search!),
        ),
      );
    }

    const announcements = await query
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems });

    const newAnnouncements = await Promise.all(
      announcements.page.map(async (announcement) => {
        return {
          ...announcement,
        };
      }),
    );

    return {
      announcements: newAnnouncements,
      continueCursor: announcements.continueCursor,
    };
  },
});
