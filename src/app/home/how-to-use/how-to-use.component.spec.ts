import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HowToUseComponent } from './how-to-use.component';

describe('HowToUseComponent', () => {
  let component: HowToUseComponent;
  let fixture: ComponentFixture<HowToUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToUseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HowToUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
