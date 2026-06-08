export const FEEDBACK_TYPES = ["bug", "feature", "general"] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export type CreateFeedbackInput = {
  content: string;
  title: string;
  type: FeedbackType;
};
