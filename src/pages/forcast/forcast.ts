import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, List } from 'ionic-angular';
import { HttpService } from "../../service/http.service"
import { NotifyService } from '../../service/notifyService'
import { MapComponent } from '../../components/map/map'
import { AqiService } from '../../service/aqiservice'
import { FilterCityPipe } from '../../pipes/filter-key/filter-city';

@Component({
  selector: 'page-forcast',
  templateUrl: 'forcast.html',
  providers: [MapComponent, HttpService, NotifyService, AqiService, FilterCityPipe]
})
export class ForcastPage {


  private UPDATE_TIME: string = "updatetime";
  private POINT_VALUE: string = "values";
  private isMap: boolean = true;

  private map: L.Map;
  private mySelfMarker: L.Marker;
  private currentMarkerObj: L.Marker;
  private currentMarker: any;
  private updatetime: string;
  private forcastValues = [];
  private layerGroup: L.LayerGroup;
  private layerGroup48: L.LayerGroup;
  private layerGroup72: L.LayerGroup;
  private currentColor: string;
  private baseUrl: string = "http://106.37.208.228:8082/Home/Default";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mapComp: MapComponent,
    public http: HttpService,
    public notify: NotifyService,
    private aqiService: AqiService

  ) {
    this.updatetime = localStorage.getItem(this.UPDATE_TIME)
    if (localStorage.getItem(this.POINT_VALUE)) {
      this.forcastValues = JSON.parse(localStorage.getItem(this.POINT_VALUE));
    }

  }


  changeView() {
    this.isMap = !this.isMap;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForcastPage');
  }
  ngAfterViewInit() {
    if (!this.map) {
      this.mapComp.mapid = "fmap";
      this.map = this.mapComp.initMap(5);
      this.layerGroup = new L.LayerGroup();
      this.layerGroup.addTo(this.map);
      this.layerGroup48 = new L.LayerGroup();
      this.layerGroup72 = new L.LayerGroup();
      this.getAllValue();
      this.map.on('click', this._onClick, this);
    }
  }
  ngOnDestroy() {
    this.map.removeLayer(this.layerGroup);
    delete this.layerGroup;
  }


  private _onClick() {
    this.currentMarker = null;
    if (this.currentMarkerObj) {
      this.map.removeLayer(this.currentMarkerObj);
      delete this.currentMarkerObj;
    }
  }
  private getAllValue() {
    let that = this;

    this.layerGroup && this.layerGroup.clearLayers();
    //预报数据发布，比今天早一天
    let today = new Date();
    if (today.getHours() < 15)
      today.setDate(today.getDate() - 1);//减去一天
    let month = today.getMonth() + 1;
    let monthStr = month > 9 ? month : '0' + month;
    let tStr = `${today.getFullYear()}年${monthStr}月${today.getDate()}日`;
    if (this.updatetime && this.updatetime != "" && this.updatetime.indexOf(tStr) > -1 && this.forcastValues.length > 0) {
      this.forcastValues.forEach(item => {
        this.createMarker(item);
      })

      return;
    } else {
      this.http.httpGet_Allow_Origin(this.baseUrl).then(res => {

        let patter = res + '';
        patter = patter.replace('\n', '');
        let regCity = new RegExp('\{"[^}]*\}', 'gim');
        let regTime = new RegExp('(update-time)">[^<]*', 'gim');
        let getNext = true;

        let time = regTime.exec(patter)[0];

        that.updatetime = time.split('>')[1];
        that.forcastValues = [];
        while (getNext) {
          let valueObj = regCity.exec(patter);
          if (!valueObj) {
            getNext = false;
            break;
          }
          let item = JSON.parse(valueObj[0]);
          let newitem = this.createMarker(item);
          that.forcastValues.push(newitem);
          console.log(item);
        }

        that.currentLayer = that.layerGroup;

        localStorage.setItem(that.UPDATE_TIME, that.updatetime);
        localStorage.setItem(that.POINT_VALUE, JSON.stringify(that.forcastValues));

      }).catch(err => {
        this.notify.showToast("获取数据失败，请稍候再试")
      })
    }
  }


  private createMarker(res) {

    let to = this.aqiService.getAQIImg(res["AirIndex_To"]);
    let from = this.aqiService.getAQIImg(res["AirIndex_From"]);
    let to48 = this.aqiService.getAQIImg(res["Air48Index_To"]);
    let from48 = this.aqiService.getAQIImg(res["Air48Index_From"]);
    let to72 = this.aqiService.getAQIImg(res["Air72Index_To"]);
    let from72 = this.aqiService.getAQIImg(res["Air72Index_From"]);
    res['bgcolor'] = { 'background-color': to.color }
    res["to"] = to;
    res["from"] = from;
    res['bgcolor48'] = { 'background-color': to48.color }
    res["to48"] = to48;
    res["from48"] = from48;
    res['bgcolor72'] = { 'background-color': to72.color }
    res["to72"] = to72;
    res["from72"] = from72;
    let iocnPath = 'assets/aqi/' + to.icon;
    let iocnPath48 = 'assets/aqi/' + to48.icon;
    let iocnPath72 = 'assets/aqi/' + to72.icon;

    let myIcon = this.aqiService.getDivIcon2(from, to);
    let myIcon48 = this.aqiService.getDivIcon2(from48, to48);
    let myIcon72 = this.aqiService.getDivIcon2(from72, to72);

    let m = L.marker([res['Latitude'], res['Longitude']], { icon: myIcon }).addTo(this.layerGroup);
    let m48 = L.marker([res['Latitude'], res['Longitude']], { icon: myIcon48 }).addTo(this.layerGroup48);
    let m72 = L.marker([res['Latitude'], res['Longitude']], { icon: myIcon72 }).addTo(this.layerGroup72);

    m.options['data'] = res;
    m.on('click', this.showCurrentMarkerInfo, this)
    m48.options['data'] = res;
    m48.on('click', this.showCurrentMarkerInfo, this)
    m72.options['data'] = res;
    m72.on('click', this.showCurrentMarkerInfo, this)
    return res;
  }
  private isClick: boolean = false;
  private showCurrentMarkerInfo(e) {
    // if (!this.currentMarkerObj) {

    //   this.currentMarkerObj = L.marker(e.target.getLatLng(), { icon: myIcon });
    //   this.currentMarkerObj.addTo(this.map);
    // } else {
    //   this.currentMarkerObj.setLatLng(e.target.getLatLng());
    // }
    this.isClick = true;

    this.currentMarker = e.target.options['data'];
    if (this.currentHours == '24h')
      this.currentColor = this.currentMarker.bgcolor;
    if (this.currentHours == '48h')
      this.currentColor = this.currentMarker.bgcolor48;
    if (this.currentHours == '72h')
      this.currentColor = this.currentMarker.bgcolor72;
    console.log(this.currentMarker);
  }
  private closeMarkerInfo() {
    this.isClick = false;
    this.currentMarker = null;
  }

  private zoomTo(e) {
    this.currentMarker = e;
    this.currentColor = this.currentMarker.bgcolor;
    let latlng = [this.currentMarker['Latitude'], this.currentMarker['Longitude']]

    this.mapComp.setNewView(latlng, 12)
    this.isMap = !this.isMap;
    this.isClick = false;
  }

  private currentHours: string = "24h";
  private currentLayer;
  private changeHours(hour) {
    this.currentHours = hour;

    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }
    if (hour == "24h") {
      this.layerGroup.addTo(this.map);
      this.currentLayer = this.layerGroup;
    }
    else if (hour == "48h") {
      this.layerGroup48.addTo(this.map);
      this.currentLayer = this.layerGroup48;
    }
    else if (hour == "72h") {
      this.layerGroup72.addTo(this.map);
      this.currentLayer = this.layerGroup72;
    }

  }

  private getLocation() {
    this.mapComp.getLocation().then(latlng => {
      this.mapComp.setNewView(latlng);
      this.notify.showToast("定位到当前位置")
      this.getAllValue();
    }).catch(err => {
      this.notify.showToast('获取用户当前位置信息错误。')
      this.getAllValue();
    })
  }

}



