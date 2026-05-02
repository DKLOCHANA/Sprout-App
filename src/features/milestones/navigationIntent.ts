import type { MilestoneCategory } from './types';

let pendingCategory: MilestoneCategory | null = null;

export function setPendingMilestoneCategory(category: MilestoneCategory) {
  pendingCategory = category;
}

export function consumePendingMilestoneCategory(): MilestoneCategory | null {
  const cat = pendingCategory;
  pendingCategory = null;
  return cat;
}
