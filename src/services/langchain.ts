import { ChatPromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { Analysis } from "@/types";


const analysisObject: z.ZodType<Analysis> = z.object({
    dishName: z.string(),
    macros: z.object({
        fat: z.string(),
        carbs: z.string(),
        protein: z.string(),
    }),
    weight: z.string(),
    energy: z.object({
        calories: z.string(),
        kilojoules: z.string(),
    }),
    nutritionalValues: z.array(z.object({
        name: z.string(),
        amount: z.string(),
    })),
    ingredients: z.array(z.object({
        name: z.string(),
        weight: z.string(),
    })),
});

function buildQueryAnalyzer(imageStr: string) {
    const systemPrompt = `You are an expert at recognizing food items and extracting nutritional information from images.
    Given a question, return a JSON object containing the exact nutritional values of the food item in the image.
    If the image isn't food or a meal, return an empty object.`;

    const userPromptTemplate = HumanMessagePromptTemplate.fromTemplate([
        { text: "What's the nutritional value of the food in this image?" },
        { image_url: imageStr },
    ]
    );

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        userPromptTemplate,
    ]);

    const structuredLLM = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
    }).withStructuredOutput(analysisObject, { name: "analysis" });

    const queryAnalyzer = RunnableSequence.from([
        { question: new RunnablePassthrough() },
        prompt,
        structuredLLM,
    ]);
    return queryAnalyzer;
}

async function askNutritionalAnalysis(imageBase64: string) {
    const queryAnalyzer = buildQueryAnalyzer(imageBase64);
    return queryAnalyzer.invoke("");
}


export { askNutritionalAnalysis };
