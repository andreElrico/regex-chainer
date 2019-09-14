import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';


@Component({
  selector: 'app-regex-control',
  templateUrl: './regex-control.component.html',
  styleUrls: ['./regex-control.component.scss'],
    providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: RegexControlComponent,
    multi: true,
  }]
})
export class RegexControlComponent implements OnInit, ControlValueAccessor {

  disabled = false;

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  flags = new FormControl(['g', 'm']);
  flagList: {f: string , d: string }[] = [
    {f:'g', d:'Global search'},
    {f:'i',	d:'Case-insensitive'},
    {f:'m',	d:'Multi-line search'},
    {f:'s',	d:'Dot matches newline'},
    {f:'u',	d:'Unicode'},
    {f:'y',	d:'Sticky'},
  ];

  get flagStr() {
    return this.flags.value ? this.flags.value.join('') : null;
  }

  patternC = new FormControl();

  constructor() { }

  ngOnInit() {
    this.flags.valueChanges.subscribe(_ => this.onChange({}) );
  }

  writeValue(obj: any): void {

    if (obj) {
      this.patternC.setValue(obj.p, {emitEvent: true});
      this.flags.setValue(obj.f.split(''), {emitEvent: true});
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.patternC.disable() : this.patternC.enable();
    this.disabled = isDisabled;
  }
  onChange(event: any) {
    const val = {p: this.patternC.value, f: this.flagStr }
    this._onChange(val);
  }
  onBlur(event: any) {
    this._onTouched();
  }

}
