import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; // Ensure DialogModule and DialogService are imported
import { LocalStorageService, QuestionService } from '../../../services';
import { DialogService } from 'primeng/dynamicdialog';
import { TEST_RESULT_KEY } from '../../../constants';
import { Test } from '../../../models';
import { CardModule } from 'primeng/card';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-new-test',
    imports: [CommonModule, ButtonModule, DialogModule, CardModule, NavbarComponent, TooltipModule, ProgressSpinnerModule],
    providers: [DialogService],
    templateUrl: './new-test.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./new-test.component.scss']
})
export class NewTestComponent implements OnInit {
  resultMessage: string = '';

  currentQuestionIndex: number = 0;

  questions: any[] = [];
  skippedQuestions: number[] = [];

  answers: { [key: number]: string } = {};

  displayResultDialog: boolean = false;
  isLoading = true;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private storageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.questionService.getQuestions().subscribe(data => {
      this.questions = data["record"].questions;
      this.loadQuestion();
      this.isLoading = false;
    });
  }

  loadQuestion(): void {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult();
    }
    if (this.currentQuestionIndex < 0) {
      this.currentQuestionIndex = 0;
    }
  }

  answerQuestion(answer: string): void {
    const questionId = this.questions[this.currentQuestionIndex]?.id;
    if (questionId) {
      this.answers[questionId] = answer;
    }
    this.nextQuestion();
  }

  skipQuestion(): void {
    if (!this.answers[this.questions[this.currentQuestionIndex]?.id]) {
      this.skippedQuestions.push(this.currentQuestionIndex);
    }
    this.nextQuestion();
  }

  previousQuestion(): void {
    if (this.skippedQuestions.length > 0) {
      this.currentQuestionIndex = this.skippedQuestions.pop()!;
      this.loadQuestion();
    } else if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion();
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
    this.loadQuestion();
  }

  submit(): void {
    if (Object.keys(this.answers).length <= this.questions.length) {
      const attemptedQuestions = Object.keys(this.answers).length;
      this.resultMessage = `You have attempted ${attemptedQuestions} out of ${this.questions.length}. Please click Confirm for results.`;
      this.displayResultDialog = true;
      return;
    }
    this.showResult();
  }

  showResult(): void {
    const correctAnswers = Object.values(this.answers).filter(answer => answer === 'Yes').length;
    const status = correctAnswers >= 7 ? 'Pass' : 'Fail';
    const tests = this.storageService.getItem(TEST_RESULT_KEY) as Test[];
    tests.push({ id: tests[tests.length - 1].id + 1, status: status, marks: correctAnswers, totalMarks: this.questions.length, completed: new Date() });
    this.storageService.setItem(TEST_RESULT_KEY, tests);
    this.displayResultDialog = false;
  }

  closeDialog(dialogOnly = false): void {
    if (!dialogOnly) {
      this.showResult();
      this.router.navigate(['/']);
    }
    else {
      this.displayResultDialog = false;
    }
  }

  isSelected(option: string): boolean {
    const questionId = this.questions[this.currentQuestionIndex]?.id;
    return questionId ? this.answers[questionId] === option : false;
  }

  isAnswered(index: number): boolean {
    const questionId = this.questions[index]?.id;
    return questionId ? !!this.answers[questionId] : false;
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
}
