import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivesRealComponent } from './archives-real.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('ArchivesRealComponent', () => {
  let component: ArchivesRealComponent;
  let fixture: ComponentFixture<ArchivesRealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivesRealComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivesRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
