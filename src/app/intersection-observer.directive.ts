import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Observable, debounceTime, Subscription } from 'rxjs';

function buildThresholdList() {
  let thresholds = [];
  let numSteps = 100;

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

@Directive({
  selector: '[appIntersectionObserver]',
  exportAs: 'intersection',
})
export class IntersectionObserverDirective {
  @Input() root: HTMLElement | null = null;
  @Input() rootMargin = '300px';
  @Input() threshold = buildThresholdList();
  @Input() debounceTime = 250;
  @Input() isContinuous = false;

  @Output() isIntersecting = new EventEmitter<boolean>();

  intersecting = false;

  subscription: Subscription;

  prevRatio = 0;
  increasingColor = 'rgba(40, 40, 190, ratio)';

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.subscription = this.createAndObserve();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createAndObserve() {
    const options: IntersectionObserverInit = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    return new Observable<boolean>((subscriber) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        console.log(entries);
        subscriber.next(isIntersecting);

        isIntersecting &&
          !this.isContinuous &&
          intersectionObserver.disconnect();

        entries.forEach((entry) => {
          if (entry.intersectionRatio > this.prevRatio) {
            this.renderer.setStyle(
              entry.target,
              'transform',
              `scale(${0 + entry.intersectionRatio}`
            );
          }
        });
      }, options);

      intersectionObserver.observe(this.element.nativeElement);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
        },
      };
    })
      .pipe(debounceTime(this.debounceTime))
      .subscribe((status) => {
        this.isIntersecting.emit(status);
        this.intersecting = status;
      });
  }
}
