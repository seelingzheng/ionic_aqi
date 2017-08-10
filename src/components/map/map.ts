import { Component, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

import { NotifyService } from '../../service/notifyService'
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  private _mapid: string;

  @Input()
  get mapid(): string {
    return this._mapid;
  }

  set mapid(id: string) {
    this._mapid = id;
  }

  public center: Array<number> = [30.703259, 104.079853];
  mapObj: L.Map;
  private byhour: boolean = true;
  private basemap: any = {
    day: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',//'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    night: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
  }

  private defaultCenter: L.LatLng = new L.LatLng(this.center[0], this.center[1]);

  public mySelfMarker: L.Marker;


  constructor(public notify: NotifyService) {
    let center = localStorage.getItem('center');
    if (center) {
      this.center = JSON.parse(center);
      this.defaultCenter = new L.LatLng(this.center[0], this.center[1]);
    }

  }

  private ngAfterViewInit() {

  }

  private ngOnDestroy() {
    // this.mapObj.remove();
  }

  public initMap(zoom?: number) {

    this.mapObj = L.map(this._mapid, {
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18
    }).setView(this.defaultCenter, zoom || 10);


    let d = new Date
    let hours = d.getHours();

    let isDay = true;
    if (this.byhour && ((hours >= 0 && hours <= 7) || (hours >= 18 && hours <= 24))) {
      isDay = false;
    }

    let copys = (isDay ? '&copy; <a href="http://ditu.amap.com/">高德地图</a>' : '&copy; <a href="http://map.geoq.cn">geoq.cn</a>') + '&copy; <a href="hhttp://aqicn.org/here/cn/">aqicn.org</a>'

    L.tileLayer(isDay ? this.basemap.day : this.basemap.night, {
      attribution: copys,
      subdomains: ["1", "2", "3", "4"],
      ['baselayer']: true

    }).addTo(this.mapObj);
    //创建用户自己所在的位置
    let MarkerIcon = L.divIcon({ className: 'marker-image' });
    this.mySelfMarker = L.marker(this.defaultCenter, {
      icon: MarkerIcon
    }).addTo(this.mapObj);
    return this.mapObj;
  }

  public getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        let latlng: any = [position.coords.latitude, position.coords.longitude];
        // alert('Latitude: ' + + '\n' +
        //   'Longitude: ' + + '\n' +
        //   'Altitude: ' + position.coords.altitude + '\n' +
        //   'Accuracy: ' + position.coords.accuracy + '\n' +
        //   'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        //   'Heading: ' + position.coords.heading + '\n' +
        //   'Speed: ' + position.coords.speed + '\n' +
        //   'Timestamp: ' + position.timestamp + '\n');
        // this.notify.showToast("定位到当前位置")
        this.defaultCenter = latlng;
        this.mySelfMarker.setLatLng(latlng);
        localStorage.setItem('center', JSON.stringify(latlng))
        resolve(latlng);
      }, error => {

        // this.notify.showToast('获取用户当前位置信息错误。')
        // this.getCurrentBoundValue();
        localStorage.setItem('center', JSON.stringify(this.center))
        reject(error)
      })
    })

  }

  public setNewView(latlng: any, zoom: number = 10, func?: Function) {
    this.mapObj.flyTo(latlng, zoom)
    // this.getCurrentBoundValue();
    if (func) {
      func();
    }

  }
}
