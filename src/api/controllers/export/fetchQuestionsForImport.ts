import { ApiResponse } from "@/shared";
import { Request, Response } from "express";
import { ExportPaperRequest, ReservedQuestionAsPractice } from "./types";
import _ from "lodash";
import { prisma } from "@/shared/prisma";
import { AuthenticatedRequest } from "@/middlewares/types";
import { ExportTypes, ExportedQuestionStatus, QuestionType } from "@prisma/client";



export const FetchQuestionsForExportHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            MCQVisible, longQuestionVisible, shortQuestionVisible, subTopicId,
            longQuestionDifficultyLevel,
            longQuestionQuantity, mcqDifficultyLevel, mcqQuestionQuantity,
            shortQuestionDifficultyLevel, shortQuestionQuantity, fillInTheBlanksQuantity, fillInTheBlanksDifficultyLevel, fillInTheBlanksVisible,
            multiFillInTheBlanksQuantity, multiFillInTheBlanksDifficultyLevel, multiFillInTheBlanksVisible, multipleShortQuantity, multipleShortDifficultyLevel, multipleShortVisible,
            multipleTrueFalseQuantity, multipleTrueFalseDifficultyLevel, multipleTrueFalseVisible, sequenceQuantity, sequenceDifficultyLevel, sequenceVisible, isPracticeMode,
            multipleQuestionV2DifficultyLevel, multipleQuestionV2Quantity, multipleQuestionV2Visible, exportMode
        } = req?.body as ExportPaperRequest;
        if (_?.isUndefined(isPracticeMode)) {
            return ApiResponse(false, "isPracticeMode is required", null, 400, res);
        }
        if (!(MCQVisible) && !(longQuestionVisible) && !(shortQuestionVisible) && !(fillInTheBlanksVisible) && !(multiFillInTheBlanksVisible) && !(multipleShortVisible) && !(multipleTrueFalseVisible) && !(sequenceVisible)) {
            return ApiResponse(false, "At least one question must be selected", null, 400, res);
        }
        let mcqQuestion;
        let shortQuestion;
        let longQuestion;
        let fillInTheBlanksQuestion;
        let multiFillInTheBlanksQuestion;
        let multipleShortQuestion;
        let multipleTrueFalseQuestion;
        let sequenceQuestion;
        let multipleShortQuestionV2;
        let usedQuestions = [] as string[];
        if (exportMode === ExportTypes.PRACTICE) {
            usedQuestions = await fetchReservedQuestions(req?.user?.id ?? "");
        }
        if (MCQVisible) {
            mcqQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.MCQ,
                    difficultyLevel: mcqDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                orderBy: {
                    createdAt: 'asc'
                },
                take: parseInt(mcqQuestionQuantity.toString()),
            });
        }
        if (shortQuestionVisible) {
            shortQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.SHORT,
                    difficultyLevel: shortQuestionDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(shortQuestionQuantity?.toString()),
            });
            console.log("shortQuestion", shortQuestion);
        }
        if (longQuestionVisible) {
            longQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.LONG,
                    difficultyLevel: longQuestionDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(longQuestionQuantity?.toString()),
            });
        }
        if (fillInTheBlanksVisible) {
            fillInTheBlanksQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.FILLINTHEBLANK,
                    difficultyLevel: fillInTheBlanksDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(fillInTheBlanksQuantity?.toString()),
            });
        }
        if (multiFillInTheBlanksVisible) {
            multiFillInTheBlanksQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.MULTIFILLINTHEBLANK,
                    difficultyLevel: multiFillInTheBlanksDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(multiFillInTheBlanksQuantity?.toString()),
            });
        }
        if (multipleShortVisible) {
            multipleShortQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.MULTIPLSHORT,
                    difficultyLevel: multipleShortDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(multipleShortQuantity?.toString()),
            });
        }
        if (multipleTrueFalseVisible) {
            multipleTrueFalseQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.MULTIPLETRUEFALSE,
                    difficultyLevel: multipleTrueFalseDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(multipleTrueFalseQuantity?.toString()),
            });
        }
        if (sequenceVisible) {
            sequenceQuestion = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.SEQUENCE,
                    difficultyLevel: sequenceDifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(sequenceQuantity?.toString()),
            });
        }
        if (multipleQuestionV2Visible) {
            multipleShortQuestionV2 = await prisma.question.findMany({
                where: {
                    subTopicId: subTopicId,
                    type: QuestionType.MULTIPLSHORTV2,
                    difficultyLevel: multipleQuestionV2DifficultyLevel,
                    id: {
                        notIn: usedQuestions
                    }
                },
                include: {
                    answers: true
                },
                take: parseInt(multipleQuestionV2Quantity?.toString()),
            });
        }
        return ApiResponse(true, "You can choose question for paper now", { mcqQuestion, shortQuestion, longQuestion, fillInTheBlanksQuestion, multiFillInTheBlanksQuestion, multipleShortQuestion, multipleTrueFalseQuestion, sequenceQuestion, multipleShortQuestionV2 }, 200, res);
    }
    catch (error) {
        console.log(error?.message);
        console.log("ExportPaperHandler::error", JSON?.stringify(error));
        return ApiResponse(false, "Something Went Wrong", error, 500, res);
    }
}

const fetchReservedQuestions = async (userId: string): Promise<string[]> => {
    try {
        const reservedQuestions = await prisma.exportedQuestion.findMany({
            where: {
                userId: userId,
                exportType: ExportTypes.PAPER
            },
            select: {
                questionsId: true
            }
        });
        return reservedQuestions?.map((question) => question?.questionsId);
    } catch (error) {
        console.log(error?.message);
        console.log("fetchReservedQuestions::error", JSON?.stringify(error));
        return [];
    }
}

export const ReserveQuestionAsPractice = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { questionIds, questionMode } = req?.body as ReservedQuestionAsPractice;
        const reserveQuestions = await prisma.exportedQuestion.createMany({
            data: questionIds?.map((questionId) => {
                return {
                    userId: req?.user?.id,
                    questionsId: questionId,
                    exportType: questionMode === "Practice" ? ExportTypes.PRACTICE : ExportTypes.PAPER
                }
            })
        });
        console.log("reserveQuestions", reserveQuestions)
        return ApiResponse(true, "Questions reserved successfully", reserveQuestions, 200, res);
    } catch (error) {
        console.log("error?.message", error?.message)
        // console.log("reserveQuestionAsPractice::error", JSON?.stringify(error?.message));
        return ApiResponse(false, "Something Went Wrong", error, 500, res);
    }
}

export const fetchReserveQuestionsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const reservedQuestions = await prisma.exportedQuestion.findMany({
            where: {
                userId: req?.user?.id,
                status:ExportedQuestionStatus.NORMAL
             }
        });
        console.log("reservedQuestions", reservedQuestions);
        return ApiResponse(true, "Questions fetched successfully", reservedQuestions, 200, res);
    } catch (error) {
        console.log("reserveQuestions::error", JSON?.stringify(error?.message));
        return ApiResponse(false, "Something Went Wrong", error, 500, res);
    }
}