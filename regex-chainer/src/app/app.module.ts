import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';
import { OnSaveSnackBar, StopDraggingDirective, FocusDirective, AppComponent } from './app.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { RegexControlComponent } from './regex-control/regex-control.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ OnSaveSnackBar, HelpDialogComponent],
  declarations: [AppComponent, RegexControlComponent, OnSaveSnackBar, StopDraggingDirective, FocusDirective, HelpDialogComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
