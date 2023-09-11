import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdMobComponent } from './ad-mob.component';

describe('AdMobComponent', () => {
  let component: AdMobComponent;
  let fixture: ComponentFixture<AdMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdMobComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
