import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from './auth-data.model';
// import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    // private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/profile']);
      } else {
        // this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        console.log(res);
        // this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
        // this.uiService.loadingStateChanged.next(false);
        // this.uiService.showSnackbar(error.message, null, 3000);
        // this.snackbar.open(error.message, null!, { duration: 3000 });
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        console.log(res);
        // this.router.navigate(['']);
        // this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
        // this.uiService.loadingStateChanged.next(false);
        // this.uiService.showSnackbar(error.message, null, 3000);
        // this.snackbar.open(error.message, null!, { duration: 3000 });
      });
  }

  logout() {
    this.afAuth.signOut();
    // this.router.navigate(['/login']);
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
