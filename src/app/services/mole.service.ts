import { Injectable } from '@angular/core';
import { Mole } from './mole.model';

@Injectable({
  providedIn: 'root'
})
export class MoleService {

  constructor() { }

  getMoles(n: number): Mole[] {
    console.log("Voici Service!")
    let moles: Mole[] = [];
    for (let i=0; i<n; i++) {
        const moleImage = new Image();
        moleImage.src = 'assets/mole.png';
        moleImage.onload = () => {
            const moleWidth = moleImage.width;    // Mole dimensions: width
            const moleHeight = moleImage.height;  // Mole dimensions: height
            const mole = new Mole(moleImage, moleWidth, moleHeight);
            moles.push(mole);    
        }
    }
    return moles;
  }
}
