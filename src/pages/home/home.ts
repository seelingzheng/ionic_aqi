import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// import { Http, ConnectionBackend } from '@angular/http';

import { NavController } from 'ionic-angular';

import { NotifyService } from '../../service/notifyService'
import { HttpService } from "../../service/http.service"
import { AqiService } from "../../service/aqiservice"
import { FilterCityPipe } from '../../pipes/filter-key/filter-city';

import { MapComponent } from '../../components/map/map'
import * as L from 'leaflet'
import * as _ from 'lodash'
// import moment from 'moment'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapComponent, HttpService, NotifyService, AqiService, FilterCityPipe]
})
export class HomePage {

  private map: any = null;
  private isMap: boolean = true;
  private currentBounds: L.LatLngBounds;
  private layerGroup: L.LayerGroup;
  private mySelfMarker: L.Marker;
  private defaultCenter: L.LatLng = new L.LatLng(30.703259, 104.079853);//move
  private currentMarker: any;
  private currentMarkerObj: L.Marker;
  private currentTime: string;
  private currentColor: string;
  private hasHideLayers = [];
  private currentLists = [];

  constructor(public navCtrl: NavController,
    public mapComp: MapComponent,
    public ef: ElementRef,
    public notify: NotifyService,
    public http: HttpService,
    private aqiservice: AqiService
  ) {
  }

  private ngAfterViewInit() {

    if (!this.map) {
      this.mapComp.mapid = "map";
      this.map = this.mapComp.initMap();
      this.mySelfMarker = this.mapComp.mySelfMarker;
      this.init();
    }
    else {
      this.getLocation();
    }
  }

  private ngOnDestroy() {
    delete this.layerGroup;
    // this.map.remove();

  }

  private init() {
    this.map.vm = this;

    this.layerGroup = new L.LayerGroup().addTo(this.map);

    this.map.on('moveend', _.debounce(this._onMoveEnd), this);
    this.map.on('click', this._onClick, this);
    this.map.on('movestart', this._onMoveStart, this)

    this.getLocation()

  }

  private getLocation() {
    this.mapComp.getLocation().then(latlng => {
      this.mapComp.setNewView(latlng);
      this.notify.showToast("定位到当前位置");
      this.getCurrentBoundValue();
    }).catch(err => {
      this.notify.showToast('获取用户当前位置信息错误。');
      this.getCurrentBoundValue();
    })
  }

  private changeView() {
    this.isMap = !this.isMap;
    this._onClick();
  }

  private _onMoveStart() {
    // this.setLayerHide();
    this.map.removeLayer(this.layerGroup);
    this.currentMarkerObj && this.map.removeLayer(this.currentMarkerObj)
  }
  private _onClick() {
    this.currentMarker = null;
    if (this.currentMarkerObj) {
      this.map.removeLayer(this.currentMarkerObj);
      delete this.currentMarkerObj;
    }
  }

  private _onMoveEnd(e) {

    let vm = e.target.vm;
    let bounds = vm.getBounds();
    let api = `https://api.waqi.info/mapq/bounds/?bounds=${bounds}&inc=placeholders&k=_2Y2EzVx9YAVscMzsPSxRWXmldZEY+ExFTFXgRLg==&_=1493729062849`;

    vm.http.httpGet(api).then((res) => {
      vm.createMarker(res);
    })
  }

  private setLayerHide() {
    if (this.map) {

      this.hasHideLayers = [];
      this.map.eachLayer(layer => {
        if (!layer.options.baselayer) {
          this.map.removeLayer(layer);
          this.hasHideLayers.push(layer);
        }

      })
    }
  }
  private setLayersShow() {
    if (this.hasHideLayers.length > 0) {
      this.hasHideLayers.forEach(layer => {
        layer.addTo(this.map);
      })
    }
  }
  private getBounds(map: L.Map): string {
    this.currentBounds = this.map.getBounds();
    let sw = this.currentBounds.getSouthWest();
    let ne = this.currentBounds.getNorthEast();

    let bounds: any = [sw.lat, sw.lng, ne.lat, ne.lng];
    return bounds.join(',');
  }

  //获取可视区域数据
  private getCurrentBoundValue() {

    let bounds = this.getBounds(this.map);

    let api = `https://api.waqi.info/mapq/bounds/?bounds=${bounds}&inc=placeholders&k=_2Y2EzVx9YAVscMzsPSxRWXmldZEY+ExFTFXgRLg==&_=1493729062849`;

    console.log(api);

    this.http.httpGet(api).then((res) => {
      this.createMarker(res);
    }).catch(err => {
      this.notify.showAlert('错误提示', '获取数据错误，请稍候重试。')
    })
  }
  private createMarker(res) {
    let that = this;
    this.layerGroup && this.layerGroup.clearLayers();
    this.currentTime = "";
    this.currentLists = res;
    res.forEach(function (data) {
      let cityName = data['city'];

      let aqi = data['aqi'] * 1;
      cityName = cityName.indexOf('(') > -1 ? cityName.split('(')[1].replace(')', '') : cityName;
      data['Name'] = cityName;
      if (that.currentTime == "") {
        let utime = data["utime"].split(' ');
        that.currentTime = utime.length > 0 ? utime[1] : data["utime"];
      }
      let tips = cityName + " " + aqi;
      var aqiInfo = that.aqiservice.getAQIImg(aqi);
      data['bgcolor'] = { 'background-color': aqiInfo.color }
      data['pcolor'] = aqiInfo.pcolor;
      data['text'] = aqiInfo.text;
      let iocnPath = 'assets/aqi/' + aqiInfo.icon;

      let myIcon = L.icon({
        iconUrl: iocnPath,
        iconSize: [24, 24],
      });

      let m = L.marker([data['lat'], data['lon']], { icon: myIcon }).addTo(that.layerGroup);

      m.options['data'] = data;
      m.on('click', that.showCurrentMarkerInfo, that)

    })
    this.layerGroup && this.layerGroup.addTo(this.map);
    this.currentMarkerObj && this.currentMarkerObj.addTo(this.map);
    //this.setLayersShow();
  }
  private showCurrentMarkerInfo(e) {

    let iocnPath = e.target._icon.src;
    let myIcon = L.icon({
      iconUrl: iocnPath,
      iconSize: [48, 48]
    });
    if (!this.currentMarkerObj) {

      this.currentMarkerObj = L.marker(e.target.getLatLng(), { icon: myIcon });
      this.currentMarkerObj.addTo(this.map);
    } else {
      this.currentMarkerObj.setIcon(myIcon);
      this.currentMarkerObj.setLatLng(e.target.getLatLng());
    }

    this.currentMarker = e.target.options['data'];
    this.currentColor = this.currentMarker.bgcolor;

  }

  private zoomTo(e) {
    this.currentMarker = e;
    this.currentColor = this.currentMarker.bgcolor;
    let latlng = [this.currentMarker['lat'], this.currentMarker['lon']]

    this.mapComp.setNewView(latlng, 12);
    this.isMap = !this.isMap;

  }
}