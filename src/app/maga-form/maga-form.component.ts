import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Maga} from '../model/maga';
import {tzValidator} from '../tzValicator';
import {MagaService} from '../services/maga.service';

import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-maga-form',
  templateUrl: './maga-form.component.html',
  styleUrls: ['./maga-form.component.scss']
})
export class MagaFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  dynamicForm: FormGroup;
  submitted = false;
  isNew = false;
  maga: Maga;

  filteredCities = [];
  cities = [];
  selectedCity = '';

  tzTypOptions = [
    {label: 'ת.ז', value: 'ת.ז'},
    {label: 'דרכון', value: 'דרכון'}

  ];

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private formBuilder: FormBuilder,
              private magaService: MagaService) {
  }

  ngOnInit(): void {
    this.magaService.getCountries().then(cities => this.cities = cities);
    this.isNew = this.config.data.isNew;
    console.log(this.config.data);
    if (!this.isNew && this.config.data) {
      this.maga = {...this.config.data.maga};
    } else {
      this.maga = {tzType: 'ת.ז', uuid: uuidv4()};

    }


    this.dynamicForm = this.formBuilder.group({
      firstName: [this.maga.firstName, [Validators.required]],
      lastName: [this.maga.lastName, [Validators.required]],
      tzType: [this.maga.tzType],
      tz: [this.maga.tz, [Validators.required, tzValidator]],
      phone: [this.maga.phone, [Validators.required, Validators.pattern(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/)]],
      phoneSec: [this.maga.phoneSec, Validators.pattern(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/)],
      city: [{city: this.maga.city}, [Validators.required]],
      uuid: [this.maga.uuid]
    });
  }

  // convenience getters for easy access to form fields
  get f(): any {
    return this.dynamicForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    }
    this.ref.close(this.dynamicForm.value);
  }

  onReset(): void {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
  }

  onClear(): void {
    // clear errors and reset ticket fields
    this.submitted = false;
  }

  filterCities(event): void {
    const filtered: any[] = [];
    const query = event.query;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cities.length; i++) {
      const city: any = this.cities[i];
      if (city.city.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(city);
      }
    }

    this.filteredCities = filtered;
  }

   tzDupValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }

    // if (!is_israeli_id_number(control.value)) {
    //   return {
    //     tzInvalid: true
    //   };
    //   return null;
    // }
  }


  ngOnDestroy(): void {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}


