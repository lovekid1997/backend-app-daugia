var excel = require('node-excel-export');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const path = require('path');
var Firebase = require('firebase-admin');

router.post('/test', function (req, res, next) {
    var ngay = req.body.day;
    var id = req.body.id;
    var message = req.body.message;
    var dayy = new Date(ngay);

    var today = Date.now();

    var db = Firebase.database();
    var rootRef = db.ref('products');

    var thatbai = [];
    var thanhcong = [];
    var all = [];
    var all2 = [];
    var listId = [];
    rootRef.once("value").then(function (data) {


        data.forEach(function (index) {
            if (parseInt(today) < parseInt(index.val()['extraTime'])) {
                console.log("chua het thoi gian dau gia");
            } else {
                var d = new Date(parseInt(index.val()['extraTime']));
                var dd = String(d.getDate()).padStart(2, '0');
                var mm = String(d.getMonth() + 1).padStart(2, '0');
                var yyyy = d.getFullYear();
                d = mm + '/' + dd + '/' + yyyy;
                var dateF = new Date(d);

                if (dayy.getTime() == dateF.getTime()) {
                    var key = index.key;
                    if (data.child(key + "/failure").exists()) {
                        if (index.val()['failure']) {
                            thatbai.push({
                                imageProduct: index.val()['imageProduct'],
                                nameProduct: index.val()['nameProduct'],
                                userId: index.val()['userId'],
                                nameProductType: index.val()['nameProductType'],
                                startPriceProduct: index.val()['startPriceProduct'],
                                status: index.val()['status'],
                                description: index.val()['description'],
                                extraTime: index.val()['extraTime'],
                                registerDate: index.val()['registerDate'],
                                winner: index.val()['winner'],
                                hide: index.val()['hide'],
                                currentPrice: index.val()['currentPrice'],
                                played: index.val()['played'],
                                failure: index.val()['failure'],
                                id: key
                            });
                        } else {
                            thanhcong.push({
                                imageProduct: index.val()['imageProduct'],
                                nameProduct: index.val()['nameProduct'],
                                userId: index.val()['userId'],
                                nameProductType: index.val()['nameProductType'],
                                startPriceProduct: index.val()['startPriceProduct'],
                                status: index.val()['status'],
                                description: index.val()['description'],
                                extraTime: index.val()['extraTime'],
                                registerDate: index.val()['registerDate'],
                                winner: index.val()['winner'],
                                hide: index.val()['hide'],
                                currentPrice: index.val()['currentPrice'],
                                failure: index.val()['failure'],
                                played: index.val()['played'],
                                id: key
                            });
                        }
                        all.push({
                            imageProduct: index.val()['imageProduct'],
                            nameProduct: index.val()['nameProduct'],
                            userId: index.val()['userId'],
                            nameProductType: index.val()['nameProductType'],
                            startPriceProduct: index.val()['startPriceProduct'],
                            status: index.val()['status'],
                            description: index.val()['description'],
                            extraTime: index.val()['extraTime'],
                            registerDate: index.val()['registerDate'],
                            winner: index.val()['winner'],
                            hide: index.val()['hide'],
                            currentPrice: index.val()['currentPrice'],
                            failure: index.val()['failure'],
                            played: index.val()['played'],
                            id: key
                        });
                    } else {
                        all2.push({
                            imageProduct: index.val()['imageProduct'],
                            nameProduct: index.val()['nameProduct'],
                            userId: index.val()['userId'],
                            nameProductType: index.val()['nameProductType'],
                            startPriceProduct: index.val()['startPriceProduct'],
                            status: index.val()['status'],
                            description: index.val()['description'],
                            extraTime: index.val()['extraTime'],
                            registerDate: index.val()['registerDate'],
                            winner: index.val()['winner'],
                            hide: index.val()['hide'],
                            currentPrice: index.val()['currentPrice'],
                            played: index.val()['played'],
                            id: key
                        });
                        listId.push(
                            index.val()['userId']);
                        listId.push(index.val()['nameProduct']);
                    }
                }
            }
        });
    }).then(() => {
        var title = "Thống kê hóa đơn hàng ngày " + ngay;

        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: 'ffff00'
                    }
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 20,
                    bold: true,
                    underline: false

                }
            },
            mauxanh: {
                fill: {
                    fgColor: {
                        rgb: 'b7dde8'
                    }
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 18,
                    bold: true,
                }
            },

            mauhong: {
                fill: {
                    fgColor: {
                        rgb: 'e6b8b8'
                    }
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 16,
                    bold: true,

                }
            },
            mauxam: {
                fill: {
                    fgColor: {
                        rgb: 'ececec'
                    }
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 14,
                    bold: true,

                }
            },

        };

        //Array of objects representing heading rows (very top)
        var heading = [
            [{ value: 'Thống kê đơn ngày ' + ngay, style: styles.headerDark }],
            [{ value: message, style: styles.mauxanh }]// <-- It can be only values
        ];
        var merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 10 } }
        ]
        const specification = {
            stt: { // <- the key should match the actual data key
                displayName: 'STT', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 50,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                }, // <- w
            },
            nameProduct: { // <- the key should match the actual data key
                displayName: 'Tên sản phẩm', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 120,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                },// <- width in pixels
            },
            productType: { // <- the key should match the actual data key
                displayName: 'Thể loại', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 120,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                }, // <- w// <- width in pixels
            },
            startPrice: { // <- the key should match the actual data key
                displayName: 'Giá khởi điểm', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 120,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                },// <- w // <- width in pixels
            },
            currentPrice: { // <- the key should match the actual data key
                displayName: 'Giá gần đây nhất', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 150,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                }, // <- w// <- width in pixels
            },
            nguoiThangCuoc: { // <- the key should match the actual data key
                displayName: 'Người thắng cuộc', // <- Here you specify the column header
                headerStyle: styles.mauhong, // <- Header style
                width: 150,
                cellStyle: function (value, row) {
                    return (parseInt(row.stt) % 2 == 0) ? {
                        fill: {
                            fgColor: {
                                rgb: 'ececec'
                            }
                        },
                        font: {
                            color: {
                                rgb: '000000'
                            },
                            sz: 14
                        }
                    } : {
                            fill: {
                                fgColor: {
                                    rgb: 'ffffff'
                                }
                            },
                            font: {
                                color: {
                                    rgb: '000000'
                                },
                                sz: 14
                            }
                        }; // <- Inline cell style is possible 
                },// <- w // <- width in pixels
            },
        }
        var dataset = [];
        var stt = 1;
        var tongtien = 0;
        var index = 0;
        var tongtiendadaugia = 0;
        if (parseInt(id) == 4) {
            all2.forEach((item) => {
                dataset.push({
                    stt: stt,
                    nameProduct: item['nameProduct'],
                    productType: item['nameProductType'],
                    startPrice: item['currentPrice'],
                    currentPrice: item['startPriceProduct'],
                    nguoiThangCuoc: item['winner'][0]
                });
                tongtien = parseInt(item['currentPrice']) + tongtien;
                tongtiendadaugia= parseInt(item['startPriceProduct']) + tongtiendadaugia;
                stt++;
                index++;
                if (index == all2.length) {
                    merges.push({ start: { row: index + 4, column: 1 }, end: { row: index + 4, column: 3 } });
                    dataset.push({
                        stt: "Tổng tiền: ",
                        startPrice: tongtien,
                        currentPrice: tongtiendadaugia,
                        nguoiThangCuoc: " "
                    });
                }
            });
        }else if(parseInt(id) == 3){
            thatbai.forEach((item) => {
                dataset.push({
                    stt: stt,
                    nameProduct: item['nameProduct'],
                    productType: item['nameProductType'],
                    startPrice: item['currentPrice'],
                    currentPrice: item['startPriceProduct'],
                    nguoiThangCuoc: item['winner'][0]
                });
                tongtien = parseInt(item['currentPrice']) + tongtien;
                tongtiendadaugia= parseInt(item['startPriceProduct']) + tongtiendadaugia;
                stt++;
                index++;
                if (index == thatbai.length) {
                    merges.push({ start: { row: index + 4, column: 1 }, end: { row: index + 4, column: 3 } });
                    dataset.push({
                        stt: "Tổng tiền: ",
                        startPrice: tongtien,
                        currentPrice: tongtiendadaugia,
                        nguoiThangCuoc: " "
                    });
                }
            });
        }else if(parseInt(id) == 2){
            thanhcong.forEach((item) => {
                dataset.push({
                    stt: stt,
                    nameProduct: item['nameProduct'],
                    productType: item['nameProductType'],
                    startPrice: item['currentPrice'],
                    currentPrice: item['startPriceProduct'],
                    nguoiThangCuoc: item['winner'][0]
                });
                tongtien = parseInt(item['currentPrice']) + tongtien;
                tongtiendadaugia= parseInt(item['startPriceProduct']) + tongtiendadaugia;
                stt++;
                index++;
                if (index == thanhcong.length) {
                    merges.push({ start: { row: index + 4, column: 1 }, end: { row: index + 4, column: 3 } });
                    dataset.push({
                        stt: "Tổng tiền: ",
                        startPrice: tongtien,
                        currentPrice: tongtiendadaugia,
                        nguoiThangCuoc: " "
                    });
                }
            });
        }else if(parseInt(id) == 1){
            all.forEach((item) => {
                dataset.push({
                    stt: stt,
                    nameProduct: item['nameProduct'],
                    productType: item['nameProductType'],
                    startPrice: item['currentPrice'],
                    currentPrice: item['startPriceProduct'],
                    nguoiThangCuoc: item['winner'][0]
                });
                tongtien = parseInt(item['currentPrice']) + tongtien;
                tongtiendadaugia= parseInt(item['startPriceProduct']) + tongtiendadaugia;
                stt++;
                index++;
                if (index == thanhcong.length) {
                    merges.push({ start: { row: index + 4, column: 1 }, end: { row: index + 4, column: 3 } });
                    dataset.push({
                        stt: "Tổng tiền: ",
                        startPrice: tongtien,
                        currentPrice: tongtiendadaugia,
                        nguoiThangCuoc: " "
                    });
                }
            });
        }


        // Define an array of merges. 1-1 = A:1
        // The merges are independent of the data.
        // A merge will overwrite all data _not_ in the top-left cell.


        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Report', // <- Specify sheet name (optional)
                    heading: heading, // <- Raw heading array (optional)
                    merges: merges, // <- Merge cell ranges
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('order.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
    });
});

module.exports = router;