import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearnComponentPOC } from './learn.component';

describe('LearnComponentPOC', () => {
  let component: LearnComponentPOC;
  let fixture: ComponentFixture<LearnComponentPOC>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnComponentPOC ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearnComponentPOC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
