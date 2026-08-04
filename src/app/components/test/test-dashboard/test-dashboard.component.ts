import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Test } from '../../../models';
import { LocalStorageService } from '../../../services';
import { TEST_RESULT_KEY } from '../../../constants';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TimeAgoPipe } from '../../../pipes';

@Component({
    selector: 'app-test-dashboard',
    imports: [CommonModule, ButtonModule, TableModule, NavbarComponent, TimeAgoPipe],
    templateUrl: './test-dashboard.component.html',
    styleUrl: './test-dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class TestDashboardComponent implements OnInit {
  lastSubmittedTest: Test | undefined;

  tests: Test[] = [
    { id: 1, status: 'Pass', marks: 7, totalMarks: 10, completed: new Date('2024-07-30T10:00:00Z') },
    { id: 2, status: 'Fail', marks: 4, totalMarks: 10, completed: new Date('2024-07-30T11:00:00Z') }
  ];


  constructor(private router: Router,private storageService:LocalStorageService) { }

  ngOnInit(): void {
    if(!this.storageService.getItem(TEST_RESULT_KEY))
    {
      this.storageService.setItem(TEST_RESULT_KEY,this.tests);
    }
    else{
      this.tests = this.storageService.getItem(TEST_RESULT_KEY) as Test[];
    }
    this.tests = this.tests.reverse();
    this.lastSubmittedTest = this.tests[0];
  }

  newTest(): void {
    this.router.navigate(['/new-quiz']);
  }
}
