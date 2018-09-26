// App({

//   /**
//    * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
//    */
//   onLaunch: function() {
//     this.startConnect();
//   },

//   startConnect: function() {
//     // 开始蓝牙连接
//     var that = this;
//     wx.showLoading({
//       title: '开启蓝牙适配',
//     });
//     console.log("startConnect");
//     // 打开蓝牙适配器
//     wx.openBluetoothAdapter({
//       success: function(res) {
//         console.log("初始化蓝牙适配器");
//         that.getBluetoothAdapterState();
//       },
//       fail: function(err) {
//         console.log(err);
//         wx.showToast({
//           title: '蓝牙初始化失败',
//           duration: 2000
//         })
//         setTimeout(function() {
//           wx.hideToast()
//         }, 2000)
//       }
//     });
//     // 开启蓝牙适配器状态监听
//     wx.onBluetoothAdapterStateChange(function(res) {
//       var available = res.available;
//       if (available) {
//         that.getBluetoothAdapterState();
//       }
//     })
//   },

//   getBluetoothAdapterState: function() {
//     // 获取本机蓝牙适配器状态
//     var that = this;
//     wx.getBluetoothAdapterState({
//         success: function(res) {
//           var available = res.available;
//           var discovering = res.discovering;
//           if (!available) {
//             // 用户没有开启蓝牙
//             wx.showToast({
//               title: '设备无法开启蓝牙连接',
//               duration: 2000
//             })
//             setTimeout(function() {
//               wx.hideToast()
//             }, 2000)
//           } else {
//             if (!discovering) {
//               that.startBluetoothDeviceDiscovery();
//               that.getConnectedBluetoothDevices();
//             }
//           }
//         }
//       })
//       },

//       startBluetoothDeviceDiscovery: function() {
//         // 开始搜索蓝牙设备
//         var that = this;
//         wx.showLoading({
//           title: '蓝牙搜索',
//         });
//         wx.startBluetoothDevicesDiscovery({
//           services: [],
//           allowDuplicatesKey: false,
//           // 是否允许复制秘钥
//           success: function(res) {
//             console.log("success");
//             if (!res.isDiscovering) {
//               that.getBluetoothAdapterState();
//             } else {
//               that.onBluetoothDeviceFound();
//             }
//           },
//           fail: function(err) {
//             console.log("fail");
//             console.log(err);
//           }
//         });
//       },

//       getConnectedBluetoothDevices: function() {
//         // 获取已配对的蓝牙设备
//         var that = this;
//         console.log("getConnectedBluetoothDevices");
//         wx.getConnectedBluetoothDevices({
//           services: [that.serviceId],
//           success: function(res) {
//             console.log("获取处于连接状态的设备", res);
//             var devices = res['devices'];
//             var flag = false;
//             var index = 0;
//             var conDevList = [];
//             devices.forEach(function(value, index, array) {
//               if (value['name'].indexOf('vivo V3M A') != -1) {
//                 // 如果存在包含name字段的设备
//                 flag = true;
//                 index += 1;
//                 conDevList.push(value['deviceId']);
//                 that.deviceId = value['deviceId'];
//                 return;
//               }
//             });
//             if (flag) {
//               this.connectDeviceIndex = 0;
//               that.loopConnect(conDevList);
//             } else {
//               if (!this.getConnectedTimer) {
//                 that.getConnectedTimer = setTimeout(function() {
//                   that.getConnectedBluetoothDevices();
//                 }, 5000);
//               }
//             }
//           },
//           fail: function(err) {
//             if (!this.getConnectedTimer) {
//               console.log("fail");
//               that.getConnectedTimer = setTimeout(function() {
//                 that.getConnectedBluetoothDevices();
//               }, 5000);
//             }
//           }
//         });
//       },

//       onBluetoothDeviceFound: function() {
//         // 开启发现附近蓝牙的监听
//         var that = this;
//         console.log('onBluetoothDeviceFound');
//         wx.onBluetoothDeviceFound(function(res) {
//           console.log('new device list has founded')
//           console.log(res);
//           if (res.devices[0]) {
//             var name = res.devices[0]['name'];
//             if (name != '') {
//               // 过滤无效的蓝牙设备，如name为空
//               if (name.indexOf('vivo V3M A') != -1) {
//                 // 只匹配name为Sumbrella的蓝牙设备（向阳伞）
//                 var deviceId = res.devices[0]['deviceId'];
//                 that.deviceId = deviceId;
//                 console.log(that.deviceId);
//                 that.startConnectDevices();
//               }
//             }
//           }
//         })
//       },

//       startConnectDevices: function(ltype, array) {
//         console.log("startConnectDevices");
//         // 开始配对
//         var that = this;
//         clearTimeout(that.getConnectedTimer);
//         that.getConnectedTimer = null;
//         clearTimeout(that.discoveryDevicesTimer);
//         // 蓝牙连接一旦开启，立刻停止扫描附近的蓝牙设备，停止读取本机已配对的设备
//         that.stopBluetoothDevicesDiscovery();
//         this.isConnectting = true;
//         wx.createBLEConnection({
//           deviceId: that.deviceId,
//           success: function(res) {
//             if (res.errCode == 0) {
//               setTimeout(function() {
//                 that.getService(that.deviceId);
//               }, 5000)
//             }
//           },
//           fail: function(err) {
//             console.log('连接失败：', err);
//             if (ltype == 'loop') {
//               that.connectDeviceIndex += 1;
//               that.loopConnect(array);
//             } else {
//               that.startBluetoothDevicesDiscovery();
//               that.getConnectedBluetoothDevices();
//             }
//           },
//           complete: function() {
//             console.log('complete connect devices');
//             this.isConnectting = false;
//           }
//         });
//       },

//       getService: function(deviceId) {
//         // 连接成功后根据deviceId获取设备的所有服务
//         var that = this;
//         // 监听蓝牙连接
//         wx.onBLEConnectionStateChange(function(res) {
//           console.log(res);
//         });
//         // 获取蓝牙设备service值
//         wx.getBLEDeviceServices({
//           deviceId: deviceId,
//           success: function(res) {
//             that.getCharacter(deviceId, res.services);
//           }
//         })
//       },

//       getCharacter: function(deviceId, services) {
//         // 读取服务的特征值
//         var that = this;
//         services.forEach(function(value, index, array) {
//           if (value == that.serviceId) {
//             that.serviceId = array[index];
//           }
//         });
//         wx.getBLEDeviceCharacteristics({
//           deviceId: deviceId,
//           serviceId: that.serviceId,
//           success: function(res) {
//             that.writeBLECharacteristicValue(deviceId, that.serviceId, that.characterId_write);
//             that.openNotifyService(deviceId, that.serviceId, that.characterId_read);
//           },
//           fail: function(err) {
//             console.log(err);
//           },
//           complete: function() {
//             console.log('complete');
//           }
//         })
//       },

//       loopConnect: function(devicesId) {
//         /*通过递归调用获取已配对蓝牙设备的deviceId，如果获取到了就去连接，devicesId         *[x] 为空说明上传调用getConnectedBluetoothDevices()时获取到的已配对设备全        *部连接失败了。则开启重新获取已配对蓝牙设备，并开启扫描附近蓝牙设备。*/
//         var that = this;
//         var listLen = devicesId.length;
//         if (devicesId[this.connectDeviceIndex]) {
//           this.deviceId = devicesId[this.connectDeviceIndex];
//           this.startConnectDevices('loop', devicesId);
//         } else {
//           console.log('已配对的设备小程序蓝牙连接失败');
//           that.startBluetoothDevicesDiscovery();
//           that.getConnectedBluetoothDevices();
//         }
//       },

//     })
