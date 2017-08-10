import { Injectable } from '@angular/core';

@Injectable()
export class AqiService {

    constructor() { }


    public getAQIImg(aqi: Number) {
        let icon = 'Q7.png';
        let color = "rgba(173, 177, 177, 0.35)";
        let pcolor = "rgba(173, 177, 177, 0.8)";
        let text = 'N/A';
        if (aqi > 0 && aqi <= 50) {
            icon = "Q1.png"
            color = "rgba(7, 253, 4, 0.35)";//"#07FD04";
            pcolor = "rgba(7, 253, 4,0.8)";//"#07FD04";
            text = "优";

        } else if (aqi > 50 && aqi <= 100) {
            icon = "Q2.png"
            color = "rgba(255, 255, 0, 0.35)";//"#FFFF00";
            pcolor = "rgba(255, 255, 0, 0.8)";//"#FFFF00";
            text = "良";
        }
        else if (aqi > 100 && aqi <= 150) {
            icon = "Q3.png"
            color = "rgba(255, 120, 5, 0.35)";//"#FF7805"
            pcolor = "rgba(255, 120, 5, 0.8)";//"#FF7805"
            text = "轻度污染";
        } else if (aqi > 150 && aqi <= 200) {
            icon = "Q4.png"
            color = "rgba(250, 1, 0, 0.35)";//"#FA0100"
            pcolor = "rgba(250, 1, 0, 0.8)";//"#FA0100"
            text = "中度污染";
        } else if (aqi > 200 && aqi <= 300) {
            icon = "Q5.png"
            color = "rgba(244, 100, 231, 0.35)";//"#F464E7"
            pcolor = "rgba(244, 100, 231, 0.8)";//"#F464E7"
            text = "重度污染";
        } else if (aqi > 300) {
            icon = "Q6.png"
            color = "rgba(121, 2, 34, 0.35)";//"#790222"
            pcolor = "rgba(121, 2, 34, 0.8)";//"#790222"
            text = "严重污染";
        }
        return {
            icon,
            color,
            pcolor,
            text
        }

    }
    public getDivIcon2(from, to) {

        return L.divIcon({
            html: `
      <div style="width:15px;height:15px">
      <div style="width:7.5px;height:15px;float:left; border-radius:15px 0 0 15px;background:${from.pcolor}"></div>
      <div style="width:7.5px;height:15px;float:left; border-radius:  0 15px 15px 0 ;background:${to.pcolor}"></div>
      </div>
      `,

            // iconUrl: iocnPath,
            iconSize: [24, 24],

        });
    }

    public getDivIcon(pcolor) {

        return L.divIcon({
            html: `
      <div style="width:15px;height:15px">
      <div style="width:15px;height:15px;float:left; border-radius:15px;background:${pcolor}"></div>
      </div>
      `,

            // iconUrl: iocnPath,
            iconSize: [24, 24],

        });
    }


}