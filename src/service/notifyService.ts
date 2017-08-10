import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular'

@Injectable()
export class NotifyService {

    static T_POS_BOTTOM: string = 'bottom';
    static T_POS_MIDDLE: string = "middle";
    static T_POS_TOP: string = "top";


    constructor(private toastCtrl: ToastController, private alertCtrl: AlertController) { }

    public showToast(msg: string, func?: Function, position: string = NotifyService.T_POS_BOTTOM, duration?: number) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: duration || 3000,
            position: position || 'bottom'
        });
        toast.onDidDismiss(() => {
            if (func)
                func();
        });

        toast.present();

        return toast;
    }
    public showAlert(title: string, content: string, btns?: any) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: btns || ['OK']
        });
        alert.present();
        return alert;
    }

}