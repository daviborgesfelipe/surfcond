import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSelectorComponent } from './region-selector.component';

describe('RegionSelectorComponent', () => {
  let component: RegionSelectorComponent;
  let fixture: ComponentFixture<RegionSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionSelectorComponent]
    });
    fixture = TestBed.createComponent(RegionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
