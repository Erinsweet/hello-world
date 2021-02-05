// <img :src="item.image ? require(`../../assets/image/${item.image}`) : ‘‘" alt="image"/>
//https://blog.csdn.net/a843334549/article/details/104669836

// ConvertDegreesToRadians(degrees){
//     return degrees * Math.PI / 180;
// },

// ConvertRadiansToDegrees(radian){
//     return radian * 180.0 / Math.PI;
// },

// HaverSin(theta){
//     let v = Math.sin(theta / 2);
//     return v*v
// },

// getDistance(latitude,longitude){
//     let app = this;
//     let lat1 = app.ConvertDegreesToRadians(app.location.latitude),
//         lon1 = app.ConvertDegreesToRadians(app.location.longitude),
//         lat2 = app.ConvertDegreesToRadians(latitude),
//         lon2 = app.ConvertDegreesToRadians(longitude),
//         vLon = Math.abs(lon1 - lon2),
//         vLat = Math.abs(lat1 - lat2),
//         h = app.HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * app.HaverSin(vLon);
//     return Math.round(12742 * Math.asin(Math.sqrt(h)) * 1000);
// },