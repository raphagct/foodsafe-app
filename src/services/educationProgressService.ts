import { supabase } from "./supabaseClient";
import type { EducationProgress } from "../types/education";

export async function fetchUserProgress(userId: string): Promise<EducationProgress> {
  const { data, error } = await supabase
    .from("education_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching education progress:", error);
    return { completedArticles: [], bookmarkedArticles: [], quizScores: {} };
  }

  const progress: EducationProgress = {
    completedArticles: [],
    bookmarkedArticles: [],
    quizScores: {},
  };

  if (!data) return progress;

  for (const row of data) {
    if (row.content_type === "article") {
      if (row.is_completed) {
        progress.completedArticles.push(row.content_id);
      }
    } else if (row.content_type === "quiz") {
      if (row.score !== null && row.score !== undefined) {
        progress.quizScores[row.content_id] = row.score;
      }
    }
  }

  return progress;
}

export async function markContentComplete(
  userId: string,
  contentId: string,
  contentType: "article" | "quiz",
  isCompleted: boolean,
  score?: number
) {
  const { error } = await supabase
    .from("education_progress")
    .upsert(
      {
        user_id: userId,
        content_id: contentId,
        content_type: contentType,
        is_completed: isCompleted,
        ...(score !== undefined ? { score } : {}),
      },
      { onConflict: "user_id, content_id" }
    );

  if (error) {
    console.error("Error updating education progress:", error);
  }
}
