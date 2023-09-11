import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpandableHeadearDemoComponent } from './expandable-headear-demo.component';

describe('ExpandableHeadearDemoComponent', () => {
  let component: ExpandableHeadearDemoComponent;
  let fixture: ComponentFixture<ExpandableHeadearDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableHeadearDemoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableHeadearDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
