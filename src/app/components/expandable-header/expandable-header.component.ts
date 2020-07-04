import { Component, Input, ElementRef, Renderer, Renderer2, } from '@angular/core';
import { DomController } from "@ionic/angular";
@Component({
  selector: 'expandable-header',
  templateUrl: './expandable-header.component.html',
  styleUrls: ['./expandable-header.component.scss'],
})
export class ExpandableHeaderComponent {


  @Input('scrollArea') scrollArea: any;
  @Input('headerHeight') headerHeight: number;
  newHeaderHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {
  }
  ngOnInit() {
    this.renderer.setStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev) {

    this.domCtrl.write(() => {
      this.newHeaderHeight = this.headerHeight - ev.detail.scrollTop;

      if (this.newHeaderHeight < 0) {
        this.newHeaderHeight = 0;
      }

      this.renderer.setStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');

      for (const headerElement of this.element.nativeElement.children) {

        const totalHeight = headerElement.offsetTop + headerElement.clientHeight;

        if (totalHeight > this.newHeaderHeight && !headerElement.isHidden) {
          headerElement.isHidden = true;
          this.renderer.setStyle(headerElement, 'opacity', '0');
        } else if (totalHeight <= this.newHeaderHeight && headerElement.isHidden) {
          headerElement.isHidden = false;
          this.renderer.setStyle(headerElement, 'opacity', '0.7');
        }
      }
    });
  }
}
