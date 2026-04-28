import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StormglassService {
  constructor(private http: HttpClient) {}

  getForecastLive(lat: number, lng: number): Observable<any> {
    const url = 'https://marine-api.open-meteo.com/v1/marine';
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('models', 'best_match')
      .set('temporal_resolution', 'hourly_3')
      .set('timezone', 'America/Sao_Paulo')
      .set(
        'hourly',
        [
          'wave_height',
          'wave_period',
          'wave_direction',
          'swell_wave_period',
          'swell_wave_direction',
          'swell_wave_height',
          'wind_wave_period',
          'wind_wave_direction',
          'wind_wave_height',
          'sea_level_height_msl',
        ].join(',')
      );

    return this.http.get<any>(url, { params });
  }

  getForecastWind(lat: number, lng: number): Observable<any> {
    const url = 'https://api.open-meteo.com/v1/forecast';
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('hourly', ['wind_speed_10m', 'wind_direction_10m'].join(','))
      .set('timezone', 'America/Sao_Paulo')
      .set('wind_speed_unit', 'kmh')
      .set('timeformat', 'iso8601')
      .set('forecast_days', '7');

    return this.http.get<any>(url, { params });
  }
}
