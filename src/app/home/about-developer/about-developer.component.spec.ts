import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutDeveloperComponent } from './about-developer.component';

describe('AboutDeveloperComponent', () => {
  let component: AboutDeveloperComponent;
  let fixture: ComponentFixture<AboutDeveloperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDeveloperComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
