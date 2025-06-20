import { fetchWeatherApi } from 'openmeteo';

export interface WeatherData {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    isDay: number;
    apparentTemperature: number;
    windSpeed10m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    windDirection10m: number;
    windGusts10m: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
    relativeHumidity2m: Float32Array;
    dewPoint2m: Float32Array;
    precipitationProbability: Float32Array;
    apparentTemperature: Float32Array;
    precipitation: Float32Array;
    rain: Float32Array;
    showers: Float32Array;
    snowfall: Float32Array;
    snowDepth: Float32Array;
    weatherCode: Float32Array;
    pressureMsl: Float32Array;
    surfacePressure: Float32Array;
    cloudCover: Float32Array;
    cloudCoverLow: Float32Array;
    cloudCoverMid: Float32Array;
    cloudCoverHigh: Float32Array;
    evapotranspiration: Float32Array;
    visibility: Float32Array;
    et0FaoEvapotranspiration: Float32Array;
    vapourPressureDeficit: Float32Array;
    windSpeed10m: Float32Array;
    windSpeed80m: Float32Array;
    windSpeed120m: Float32Array;
    windSpeed180m: Float32Array;
    windDirection10m: Float32Array;
    windDirection120m: Float32Array;
    windDirection180m: Float32Array;
    windDirection80m: Float32Array;
    windGusts10m: Float32Array;
    temperature80m: Float32Array;
    temperature120m: Float32Array;
    temperature180m: Float32Array;
    soilTemperature0cm: Float32Array;
    soilTemperature6cm: Float32Array;
    soilTemperature18cm: Float32Array;
    soilTemperature54cm: Float32Array;
    soilMoisture0To1cm: Float32Array;
    soilMoisture1To3cm: Float32Array;
    soilMoisture3To9cm: Float32Array;
  };
  daily: {
    time: Date[];
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
    weatherCode: Float32Array;
    apparentTemperatureMax: Float32Array;
    sunrise: Date[];
    sunset: Date[];
    sunshineDuration: Float32Array;
    daylightDuration: Float32Array;
    uvIndexMax: Float32Array;
    uvIndexClearSkyMax: Float32Array;
    rainSum: Float32Array;
    showersSum: Float32Array;
    snowfallSum: Float32Array;
    precipitationSum: Float32Array;
    precipitationHours: Float32Array;
    precipitationProbabilityMax: Float32Array;
    windSpeed10mMax: Float32Array;
    windGusts10mMax: Float32Array;
    windDirection10mDominant: Float32Array;
    shortwaveRadiationSum: Float32Array;
  };
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const locations: Location[] = [
  { id: 'farm-central', name: 'Fazenda Central', latitude: -23.5505, longitude: -46.6333 }, // São Paulo
  { id: 'north-fields', name: 'Campos Norte', latitude: -22.9068, longitude: -43.1729 }, // Rio de Janeiro
  { id: 'south-pasture', name: 'Pastagem Sul', latitude: -25.4284, longitude: -49.2733 }, // Curitiba
  { id: 'east-orchard', name: 'Pomar Leste', latitude: -19.9167, longitude: -43.9345 }, // Belo Horizonte
  { id: 'west-plantation', name: 'Plantação Oeste', latitude: -15.7942, longitude: -47.8822 } // Brasília
];

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const params = {
    latitude,
    longitude,
    daily: [
      "temperature_2m_max", "temperature_2m_min", "weather_code", "apparent_temperature_max", 
      "sunrise", "sunset", "sunshine_duration", "daylight_duration", "uv_index_max", 
      "uv_index_clear_sky_max", "rain_sum", "showers_sum", "snowfall_sum", 
      "precipitation_sum", "precipitation_hours", "precipitation_probability_max", 
      "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant", 
      "shortwave_radiation_sum"
    ],
    hourly: [
      "temperature_2m", "relative_humidity_2m", "dew_point_2m", "precipitation_probability", 
      "apparent_temperature", "precipitation", "rain", "showers", "snowfall", "snow_depth", 
      "weather_code", "pressure_msl", "surface_pressure", "cloud_cover", "cloud_cover_low", 
      "cloud_cover_mid", "cloud_cover_high", "evapotranspiration", "visibility", 
      "et0_fao_evapotranspiration", "vapour_pressure_deficit", "wind_speed_10m", 
      "wind_speed_80m", "wind_speed_120m", "wind_speed_180m", "wind_direction_10m", 
      "wind_direction_120m", "wind_direction_180m", "wind_direction_80m", "wind_gusts_10m", 
      "temperature_80m", "temperature_120m", "temperature_180m", "soil_temperature_0cm", 
      "soil_temperature_6cm", "soil_temperature_18cm", "soil_temperature_54cm", 
      "soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm"
    ],
    current: [
      "temperature_2m", "relative_humidity_2m", "is_day", "apparent_temperature", 
      "wind_speed_10m", "precipitation", "rain", "showers", "snowfall", 
      "wind_direction_10m", "wind_gusts_10m", "cloud_cover", "pressure_msl", "surface_pressure"
    ]
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  const sunrise = daily.variables(4)!;
  const sunset = daily.variables(5)!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData: WeatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      relativeHumidity2m: current.variables(1)!.value(),
      isDay: current.variables(2)!.value(),
      apparentTemperature: current.variables(3)!.value(),
      windSpeed10m: current.variables(4)!.value(),
      precipitation: current.variables(5)!.value(),
      rain: current.variables(6)!.value(),
      showers: current.variables(7)!.value(),
      snowfall: current.variables(8)!.value(),
      windDirection10m: current.variables(9)!.value(),
      windGusts10m: current.variables(10)!.value(),
      cloudCover: current.variables(11)!.value(),
      pressureMsl: current.variables(12)!.value(),
      surfacePressure: current.variables(13)!.value(),
    },
    hourly: {
      time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
      dewPoint2m: hourly.variables(2)!.valuesArray()!,
      precipitationProbability: hourly.variables(3)!.valuesArray()!,
      apparentTemperature: hourly.variables(4)!.valuesArray()!,
      precipitation: hourly.variables(5)!.valuesArray()!,
      rain: hourly.variables(6)!.valuesArray()!,
      showers: hourly.variables(7)!.valuesArray()!,
      snowfall: hourly.variables(8)!.valuesArray()!,
      snowDepth: hourly.variables(9)!.valuesArray()!,
      weatherCode: hourly.variables(10)!.valuesArray()!,
      pressureMsl: hourly.variables(11)!.valuesArray()!,
      surfacePressure: hourly.variables(12)!.valuesArray()!,
      cloudCover: hourly.variables(13)!.valuesArray()!,
      cloudCoverLow: hourly.variables(14)!.valuesArray()!,
      cloudCoverMid: hourly.variables(15)!.valuesArray()!,
      cloudCoverHigh: hourly.variables(16)!.valuesArray()!,
      evapotranspiration: hourly.variables(17)!.valuesArray()!,
      visibility: hourly.variables(18)!.valuesArray()!,
      et0FaoEvapotranspiration: hourly.variables(19)!.valuesArray()!,
      vapourPressureDeficit: hourly.variables(20)!.valuesArray()!,
      windSpeed10m: hourly.variables(21)!.valuesArray()!,
      windSpeed80m: hourly.variables(22)!.valuesArray()!,
      windSpeed120m: hourly.variables(23)!.valuesArray()!,
      windSpeed180m: hourly.variables(24)!.valuesArray()!,
      windDirection10m: hourly.variables(25)!.valuesArray()!,
      windDirection120m: hourly.variables(26)!.valuesArray()!,
      windDirection180m: hourly.variables(27)!.valuesArray()!,
      windDirection80m: hourly.variables(28)!.valuesArray()!,
      windGusts10m: hourly.variables(29)!.valuesArray()!,
      temperature80m: hourly.variables(30)!.valuesArray()!,
      temperature120m: hourly.variables(31)!.valuesArray()!,
      temperature180m: hourly.variables(32)!.valuesArray()!,
      soilTemperature0cm: hourly.variables(33)!.valuesArray()!,
      soilTemperature6cm: hourly.variables(34)!.valuesArray()!,
      soilTemperature18cm: hourly.variables(35)!.valuesArray()!,
      soilTemperature54cm: hourly.variables(36)!.valuesArray()!,
      soilMoisture0To1cm: hourly.variables(37)!.valuesArray()!,
      soilMoisture1To3cm: hourly.variables(38)!.valuesArray()!,
      soilMoisture3To9cm: hourly.variables(39)!.valuesArray()!,
    },
    daily: {
      time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      temperature2mMin: daily.variables(1)!.valuesArray()!,
      weatherCode: daily.variables(2)!.valuesArray()!,
      apparentTemperatureMax: daily.variables(3)!.valuesArray()!,
      sunrise: [...Array(sunrise.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      sunset: [...Array(sunset.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      sunshineDuration: daily.variables(6)!.valuesArray()!,
      daylightDuration: daily.variables(7)!.valuesArray()!,
      uvIndexMax: daily.variables(8)!.valuesArray()!,
      uvIndexClearSkyMax: daily.variables(9)!.valuesArray()!,
      rainSum: daily.variables(10)!.valuesArray()!,
      showersSum: daily.variables(11)!.valuesArray()!,
      snowfallSum: daily.variables(12)!.valuesArray()!,
      precipitationSum: daily.variables(13)!.valuesArray()!,
      precipitationHours: daily.variables(14)!.valuesArray()!,
      precipitationProbabilityMax: daily.variables(15)!.valuesArray()!,
      windSpeed10mMax: daily.variables(16)!.valuesArray()!,
      windGusts10mMax: daily.variables(17)!.valuesArray()!,
      windDirection10mDominant: daily.variables(18)!.valuesArray()!,
      shortwaveRadiationSum: daily.variables(19)!.valuesArray()!,
    },
  };

  return weatherData;
};

// Função para interpretar códigos de clima
export const getWeatherCondition = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Garoa gelada leve',
    57: 'Garoa gelada intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva intensa',
    66: 'Chuva gelada leve',
    67: 'Chuva gelada intensa',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve intensa',
    77: 'Granizo',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva intensas',
    85: 'Pancadas de neve leves',
    86: 'Pancadas de neve intensas',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo intenso'
  };
  
  return weatherCodes[code] || 'Condição desconhecida';
};

