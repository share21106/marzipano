import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TransitionComponent } from './transition/transition.component';
// import { FieldComponent } from './field/field.component';
// import { GolfComponent } from './golf/golf.component';

@NgModule({
  declarations: [
    AppComponent,
    TransitionComponent,
    // FieldComponent,
    // GolfComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: TransitionComponent },
      // { path: 'transition', component: TransitionComponent },
      // { path: 'field', component: FieldComponent },
      // { path: 'golf', component: GolfComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
