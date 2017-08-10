import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about';
import { ForcastPage } from '../pages/forcast/forcast';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapComponent } from '../components/map/map';
import { PipeModule } from '../pipes/pipe.module';
import { Map3dComponent } from '../components/map3d/map3d';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ForcastPage,
    AboutPage,
    MapComponent,
    Map3dComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipeModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AboutPage,
    ForcastPage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
