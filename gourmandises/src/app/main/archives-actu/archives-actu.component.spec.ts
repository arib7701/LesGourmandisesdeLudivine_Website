import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivesActuComponent } from './archives-actu.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('ArchivesActuComponent', () => {
  let component: ArchivesActuComponent;
  let fixture: ComponentFixture<ArchivesActuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivesActuComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivesActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
