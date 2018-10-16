import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataSubComponent } from './list-data-sub.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('ListDataSubComponent', () => {
  let component: ListDataSubComponent;
  let fixture: ComponentFixture<ListDataSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListDataSubComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
