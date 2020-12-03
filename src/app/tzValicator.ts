import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';

export function tzValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (!control.value) {
    return null;
  }

  if (!is_israeli_id_number(control.value)) {
    return {
      tzInvalid: true
    };
    return null;
  }
}


function is_israeli_id_number(id): any{
  id = String(id).trim();
  if (id.length > 9 || isNaN(id)) return false;
  id = id.length < 9 ? ('00000000' + id).slice(-9) : id;
  let res =  Array.from(id, Number).reduce((counter, digit, i) => {
    const step = digit * ((i % 2) + 1);
    return counter + (step > 9 ? step - 9 : step);
  });
  return res % 10 === 0;
}


