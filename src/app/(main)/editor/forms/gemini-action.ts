"use server";
import model from "@/lib/gemini";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // const subscriptionLevel = await getUserSubscriptionLevel(userId);

  // if (!canUseAITools(subscriptionLevel)) {
  //   throw new Error("Upgrade your subscription to use this feature");
  // }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (
          exp,
        ) => `Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}`,
      )
      .join("\n\n")}

    Education:
    ${educations
      ?.map(
        (edu) =>
          `Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}`,
      )
      .join("\n\n")}

    Skills:
    ${skills}
  `;

  const prompt = `${systemMessage}\n\n${userMessage}`;

  try {
    const aiResponse = await model.generateContent(prompt);

    if (!aiResponse || !aiResponse.response?.text) {
      throw new Error("Failed to generate AI response");
    }

    return aiResponse.response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error.message || error);
    throw new Error("Failed to generate summary.");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // const subscriptionLevel = await getUserSubscriptionLevel(userId);

  // if (!canUseAITools(subscriptionLevel)) {
  //   throw new Error("Upgrade your subscription to use this feature");
  // }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;
  const prompt = `${systemMessage}\n\n${userMessage}`;

  try {
    const aiResponse = await model.generateContent(prompt);

    if (!aiResponse || !aiResponse.response?.text) {
      throw new Error("Failed to generate AI response");
    }

    return {
      position: aiResponse.response.text().match(/Job title: (.*)/)?.[1] || "",
      company: aiResponse.response.text().match(/Company: (.*)/)?.[1] || "",
      description: (
        aiResponse.response.text().match(/Description:([\s\S]*)/)?.[1] || ""
      ).trim(),
      startDate: aiResponse.response
        .text()
        .match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
      endDate: aiResponse.response
        .text()
        .match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    };
  } catch (error: any) {
    console.error("Gemini API error:", error.message || error);
    throw new Error("Failed to generate summary.");
  }
}
