// Angular 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Routes
import { RouterModule, Routes } from '@angular/router';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// FireBase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';        // Firebase environment.ts file 
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// AuthGuard
import { AuthGuard } from './services/auth.guard';

// Pages
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BattlesComponent } from './game/battles/battles.component';


const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full'},     // Initial Path
  { path: 'home', component: HomeComponent},              // Home Page
  { path: 'login', component: LoginComponent},            // Login Page
  { path: 'signup', component: SignupComponent},          // Signup Page
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Dashboard
  { path: '**', component: HomeComponent},                // Wild card 404 page


] 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    BattlesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
