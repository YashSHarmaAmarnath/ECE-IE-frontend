import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const QuizAnswers = ({ quizData }) => {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-4">{quizData.title}</h2>
            <Accordion type="single" collapsible>
                {quizData.questions.map((q, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white ">{q.question}</AccordionTrigger>
                        <AccordionContent >
                            <Card>
                                <CardContent className="p-4">
                                    <p className="font-semibold">Correct Answer: {q.correctAnswer}</p>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default QuizAnswers;
