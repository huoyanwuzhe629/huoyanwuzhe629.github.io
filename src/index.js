/*
* @Author: xiongsheng
* @Date:   2016-05-18 19:04:37
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-05-19 15:04:34
*/

require('../asset/css/entry.css');

(function() {
    var slider = $('.flexslider').flexslider({
        animation: "slide",
        directionNav: false,
        slideshowSpeed: 4000,
        pauseOnAction: false,
        keyboard: false,
        start: function(slider) {
            //当点击小圆点时
            //会在选中的图片停留4秒＋1秒也就是5秒
            //然后继续轮播
            $('.flex-control-nav').find('a').click(function() {
                slider.pause();
                setTimeout(function() {
                    slider.play();
                }, 1000)

            })
        }
    });
})();
