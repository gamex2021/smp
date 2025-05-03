/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from 'convex/values';

import { internal } from '../_generated/api';
import {
    action,
    internalMutation
} from '../_generated/server';

// the mutation to create an announcement
export const createEntry = internalMutation({
    args: {
      title: v.string(),
      content: v.string(),
      schoolId: v.id('schools'),
      createdBy: v.id('users'),
    },
    handler: async (ctx, args) => {
      return await ctx.db.insert('announcements', {
        title: args.title,
        content: args.content,
        schoolId: args.schoolId,
        createdBy: args.createdBy,
        createdAt: new Date().toISOString(),
      });
    },
  });


  // action to create an announcement
export const createAnnouncement = action({
    args: {
      title: v.string(),
      content: v.string(),
      schoolId: v.id('schools'),
      createdBy: v.id('users'),
    },
    handler: async (ctx, args) => {
      const announcementId = await ctx.runMutation(
        internal.mutations.announcements.createEntry,
        {
          title: args.title,
          content: args.content,
          schoolId: args.schoolId,
          createdBy: args.createdBy,
        }
      );
  
      return { success: true };
    },
  });

  
  // action to update an announcement
export const updateAnnouncement = action({
    args: {
      id: v.id('announcements'),
      title: v.string(),
      content: v.string(),
    },
    handler: async (ctx, args) => {
      const { id, ...updateFields } = args;
  
      const existingAnnouncement = await ctx.runQuery(
        internal.queries.announcements.getAnnouncement,
        {
          id,
        }
      );
      if (!existingAnnouncement) {
        throw new Error('Invalid announcement ID');
      }
  
      await ctx.runMutation(internal.mutations.announcements.updateAnAnnouncement, {
        id,
        ...updateFields,
        updatedAt: new Date().toISOString(),
      });
    },
  });
  

  // mutation to update the announcement
export const updateAnAnnouncement = internalMutation({
    args: {
      id: v.id('announcements'),
      title: v.string(),
      content: v.string(),
      updatedAt: v.string(),
    },
    handler: async (ctx, args) => {
      const { id, ...updateFields } = args;
      await ctx.db.patch(id, updateFields);
    },
  });

  

  // function action to delete an announcement
export const deleteAnnouncement = action({
    args: {
      id: v.id('announcements'),
    },
    handler: async (ctx, args) => {
      const existingAnnouncement = await ctx.runQuery(
        internal.queries.announcements.getAnnouncement,
        {
          id: args.id,
        }
      );
      if (!existingAnnouncement) {
        throw new Error('Invalid announcement ID');
      }
  
      await ctx.runMutation(internal.mutations.announcements.deleteAnAnnouncement, {
        id: args.id,
      });
  
      return { success: true };
    },
  });
  
  // mutation to delete the announcement
  export const deleteAnAnnouncement = internalMutation({
    args: { id: v.id('announcements') },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });






