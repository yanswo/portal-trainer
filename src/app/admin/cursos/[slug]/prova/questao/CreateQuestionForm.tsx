"use client";

import { useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import Select from "@/app/components/ui/Select/Select";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { createQuestion } from "@/app/actions/exams";
import styles from "../criar/page.module.css";

export default function CreateQuestionPage({
  params,
  examId,
  courseTitle,
}: {
  params: { slug: string };
  examId: string;
  courseTitle: string;
}) {
  const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("0");

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (parseInt(correctAnswer) === index) {
        setCorrectAnswer("0");
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link
          href={`/admin/cursos/${params.slug}/prova`}
          className={styles.backButton}
        >
          <FaArrowLeft /> Voltar à Prova
        </Link>
        <div>
          <Badge variant="outline">Nova Questão</Badge>
          <h1>Adicionar Questão - {courseTitle}</h1>
          <p>Configure uma nova questão para a prova</p>
        </div>
      </div>

      <form action={createQuestion.bind(null, examId)} className={styles.form}>
        <div className={styles.section}>
          <h2>Informações da Questão</h2>

          <div className={styles.field}>
            <Label htmlFor="question">Enunciado da Questão *</Label>
            <Textarea
              id="question"
              name="question"
              placeholder="Digite a pergunta que será apresentada ao aluno..."
              rows={4}
              required
            />
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <Label htmlFor="type">Tipo de Questão *</Label>
              <Select
                id="type"
                name="type"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
                <option value="TRUE_FALSE">Verdadeiro ou Falso</option>
                <option value="ESSAY">Dissertativa</option>
              </Select>
            </div>

            <div className={styles.field}>
              <Label htmlFor="points">Pontuação *</Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="0.1"
                step="0.1"
                defaultValue="1"
                required
              />
              <span className={styles.hint}>Pontos que vale esta questão</span>
            </div>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {questionType === "MULTIPLE_CHOICE" && (
          <div className={styles.section}>
            <h2>Alternativas</h2>
            <div className={styles.optionsList}>
              {options.map((option, index) => (
                <div key={index} className={styles.optionField}>
                  <input
                    type="radio"
                    name="correctAnswerIndex"
                    value={index}
                    checked={correctAnswer === index.toString()}
                    onChange={() => setCorrectAnswer(index.toString())}
                    required
                  />
                  <span style={{ fontWeight: 600, minWidth: "30px" }}>
                    {String.fromCharCode(65 + index)})
                  </span>
                  <Input
                    name={`option${index}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Digite a alternativa..."
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addOption}
                className={styles.addOption}
              >
                <FaPlus /> Adicionar Alternativa
              </Button>
            )}

            <input
              type="hidden"
              name="correctAnswer"
              value={options[parseInt(correctAnswer)]}
            />
          </div>
        )}

        {/* True/False */}
        {questionType === "TRUE_FALSE" && (
          <div className={styles.section}>
            <h2>Resposta Correta</h2>
            <div className={styles.field}>
              <Select id="correctAnswer" name="correctAnswer" required>
                <option value="Verdadeiro">Verdadeiro</option>
                <option value="Falso">Falso</option>
              </Select>
            </div>
          </div>
        )}

        {/* Essay */}
        {questionType === "ESSAY" && (
          <div className={styles.section}>
            <h2>Critérios de Avaliação</h2>
            <div className={styles.field}>
              <Label htmlFor="correctAnswer">Resposta Esperada/Gabarito</Label>
              <Textarea
                id="correctAnswer"
                name="correctAnswer"
                placeholder="Descreva os pontos principais que devem ser abordados na resposta..."
                rows={4}
              />
              <span className={styles.hint}>
                Isso servirá como guia para correção manual
              </span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            href={`/admin/cursos/${params.slug}/prova`}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar Questão</Button>
        </div>
      </form>
    </div>
  );
}
