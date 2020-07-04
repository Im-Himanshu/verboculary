import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllWordsComponent } from './all-words.component';

describe('AllWordsComponent', () => {
  let component: AllWordsComponent;
  let fixture: ComponentFixture<AllWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWordsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
