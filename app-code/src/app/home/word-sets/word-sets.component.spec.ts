import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WordSetsComponent } from './word-sets.component';

describe('WordSetsComponent', () => {
  let component: WordSetsComponent;
  let fixture: ComponentFixture<WordSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordSetsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WordSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
