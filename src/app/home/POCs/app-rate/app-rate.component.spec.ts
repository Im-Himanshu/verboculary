import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppRateComponent } from './app-rate.component';

describe('AppRateComponent', () => {
  let component: AppRateComponent;
  let fixture: ComponentFixture<AppRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
