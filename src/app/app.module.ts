import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@NgModule({
  declarations: [AppComponent, IntersectionObserverDirective],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  exports: [IntersectionObserverDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
