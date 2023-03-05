import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasComponent } from './canvas/canvas.component';
import { FormsModule } from '@angular/forms';
import { GolsettingsComponent } from './golsettings/golsettings.component';
import { ActualcanvasComponent } from './actualcanvas/actualcanvas.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    GolsettingsComponent,
    ActualcanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
