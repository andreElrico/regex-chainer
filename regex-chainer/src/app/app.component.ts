import { Component, OnInit, Inject, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatDialog } from '@angular/material/dialog';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';

export const DELIM = '***';
export const DELIM_R = '[*]{3}';
const defaultTitle = 'My app-Title';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  form: FormGroup;

  expanded = true;

  appTitle = defaultTitle;
  showTitleInput = false;

  dragListDisabled = {bool: false};

  showResults = false;

  model = {input: '', result: ''};

  get controls() {
    return (this.form.get('regexSub') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      regexSub: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route2FormArray();

    if ( !this.form.get('regexSub').value.length ) {
      this.addRegSub();
    }

  }

  route2FormArray() {

     const url = window.location.href;

     if (url.includes('/#/')) {

      this.expanded = false;

      let ans = url.replace(/^.*\/#\//, '');

      const title = ans.replace(new RegExp(`^(.*)${DELIM_R}.*$`), '$1');

      if (title) {
        this.appTitle = title;
      }

      ans = ans.replace(new RegExp(`^.*${DELIM_R}`), '');

      ans = decodeURIComponent(ans);

      ans = JSON.parse(ans);



      const regexSub = this.form.controls.regexSub as FormArray;

      (ans as unknown as Array<{}>).forEach(el => {
        regexSub.push(this.fb.group( el ));
      });

     }
  }

  onRegexResult() {

    this.showResults = true;

    let arr  = this.form.get('regexSub').value;

    arr = arr.map(el => {
      return [new RegExp(el.pattern.p, el.pattern.f), el.sub];
    });

    const replacements = new Map( arr );
    let article = this.model['input'];

    replacements.forEach( (value: string, key: RegExp) => {
      article = article.replace(key, value);
    });

    this.model['result'] = article;
  }

  addRegSub() {
    const regexSub = this.form.controls.regexSub as FormArray;
    regexSub.push(this.fb.group({
      pattern: '',
      sub: '',
    }));
  }

  delRegSub(index) {
    (this.form.controls.regexSub as FormArray).removeAt(index);

  }

  onSave() {

    const obj = this.form.get('regexSub').value;

    let ans = JSON.stringify(obj); //.replace(/\s/gm, '');

    const url = window.location.href.replace(/#\/.*$/, '/');

    const title = this.appTitle === defaultTitle ? '' : this.appTitle;

    ans = url + '#/' + title + DELIM + ans;

    this._snackBar.openFromComponent(OnSaveSnackBar, { data: ans });
  }

  onHelp() {
    const dialogRef = this.dialog.open(HelpDialogComponent);
  }

  toggleDisableAll() {
    const a = this.form.get('regexSub') as FormArray;

    const bool = a.controls.every(a => a.disabled);

    bool ? a.enable() : a.disable();
  }

  toggleDisable(i) {
    const ag = this.form.get('regexSub' + '.' + i);

    ag.disabled ? ag.enable() : ag.disable();
  }

  /* drop */

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form.get('regexSub')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.form.get('regexSub')['value'], event.previousIndex, event.currentIndex);
  }

}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'your-snack-bar',
  template: `<a [href]=data>CopyThisUrl</a>
             <button mat-icon-button color="warn" (click)="sbRef.dismiss();">
                <mat-icon>close</mat-icon>
            </button>`,
  styles: [`:host {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }`]
})
// tslint:disable-next-line: component-class-suffix
export class OnSaveSnackBar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    @Inject(MatSnackBarRef) public sbRef: MatSnackBarRef<OnSaveSnackBar>) { }
}


import {Directive, HostListener} from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[stopDragging]'
})
export class StopDraggingDirective
{
    @Input() stopDragging: {bool: boolean};
    @HostListener('mouseenter', ['$event'])
    @HostListener('touchstart', ['$event'])
    public disable(event: any): void
    {
        this.stopDragging.bool = true;
    }

    @HostListener('mouseleave', ['$event'])
    @HostListener('touchend', ['$event'])
    public enable(event: any): void
    {
        this.stopDragging.bool = false;
    }
}

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnChanges {

  @Input()
  get focus(): any { return this._focus; }
  set focus(focus: any) { this._focus = coerceBooleanProperty(focus); }
  private _focus = false;

  constructor(private elementRef : ElementRef ) { }

  ngOnChanges() {

    if (this.focus) {
      this.elementRef.nativeElement.focus();
    }
  }
}
