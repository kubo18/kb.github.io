/*
 * 智能机浏览器版本信息:
 */
var browser = {
  versions: (function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      weixin: u.match(/MicroMessenger/i), //微信浏览器
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};
$(document).ready(function () {
  if (browser.versions.weixin) {
    if (
      browser.versions.ios ||
      browser.versions.iphone ||
      browser.versions.ipad
    ) {
      $(".wtips img").attr("src", "images/tips_weixin_ios.png");
      $(".wtips").show();
    } else {
      $(".wtips img").attr("src", "images/tips_weixin_android.png");
      $(".wtips").show();
    }
  }
  if (browser.versions.android) {
    $(".xiazai_az").show();
  } else if (
    browser.versions.ios ||
    browser.versions.iphone ||
    browser.versions.ipad
  ) {
    $(".xiazai_ios").show();
  } else {
    $(".xiazai_az").show();
  }
  $("body").css({
    width: $(window).width(),
    height: $(window).height(),
    overflow: "hidden",
  });
  $(".wz>p").css("font-size", $(window).width() * 0.86 * 0.66 * 0.1);
  var clipboard = new ClipboardJS("#copyButton", {
    text: function () {
      return document
        .getElementById("copyButton")
        .getAttribute("data-copy-text");
    },
  });
  clipboard.on("success", function () {
    console.log("文本已成功复制到剪切板。");
  });

  clipboard.on("error", function (e) {
    console.log("复制失败:", e);
  });
  var t = getUrlParameter("t");
  $.ajax({
    url: "https://kb.chaodou.online/Hh/getCommandData", //url: "https://qiniu.youlun.online/Hh/getCommandData", // 替换为你的服务器端点
    method: "POST",
    data: { command: t, type: 2 },
    success: function (response) {
      console.log(response);
      if (response.code == 1000) {
        // 假设服务器返回的响应包含复制文本
        var copyText = response.data.command;
        console.log(copyText);
        // 设置到剪切板按钮的 data-copy-text 属性
        $("#copyButton").attr("data-copy-text", copyText);
        // 自动触发点击事件
        //$('#copyButton').click(); //无法复制内容，安装与没安装判断也不对
      }
    },
    error: function (xhr, status, error) {
      console.error("获取数据失败:", error);
    },
  });
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  function UrlParameters() {
    var urlIndex = window.location.href.indexOf("?");
    if (urlIndex) {
      var parameters = window.location.href.substring(urlIndex + 1);
      if (parameters) {
        var arrayParam = parameters.split("&"); //参数数组
        var index;
        var name;
        var value;
        for (var i = 0; i < arrayParam.length; i++) {
          index = arrayParam[i].indexOf("=");
          name = arrayParam[i].substring(0, index);
          value = arrayParam[i].substring(index + 1);
          this[name] = value;
        }
      }
    }
  }
  function toUrl(url, msg = "") {
    if (msg) {
      alert(msg);
    }
    return (window.location = url);
  }
});
function checkAppInstallation() {
  var urlScheme = "um.66d7d952cac2a664dea1fb19"; //ios URL Scheme
  var androidScheme = "cdrjkb://"; //android URL Scheme
  var appStoreUrl =
    "https://apps.apple.com/cn/app/coolplayer-%E9%85%B7%E6%92%AD-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8/id6630381534"; // App Store 链接
  //var playStoreUrl = "https://zx.qiniu.youlun.online/apk/release/kb.apk"; // Android Play Store 链接  https://ghproxy.com/
  //var playStoreUrl = "https://ghproxy.com/https://raw.githubusercontent.com/kubo18/kb.github.io/refs/heads/main/apk/release/kb.apk";
  var playStoreUrl =
    "https://ghproxy.cc/https://raw.githubusercontent.com/kubo18/kb.github.io/refs/heads/main/apk/release/kb.apk";
  //https://ghproxy.cc/https://raw.githubusercontent.com/kubo18/kb.github.io/refs/heads/main/images/b.webp

  var timeout = 500; // 延迟时间（毫秒）
  var appOpened = false; // 标志位
  // 判断平台
  if (browser.versions.android) {
    // 尝试打开应用
    const startTime = Date.now();
    let timeout = setTimeout(() => {
      // 如果超时，跳转到下载页面
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        // 超时设为 2 秒
        window.location.href = playStoreUrl;
      }
    }, 1500);

    // 尝试打开应用
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = androidScheme;
    document.body.appendChild(iframe);

    // 清理 iframe 和超时逻辑
    window.onblur = () => clearTimeout(timeout);
    setTimeout(() => document.body.removeChild(iframe), 2000);
    /*
    // 创建一个不可见的 iframe
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = androidScheme;
    document.body.appendChild(iframe); //TODO:无效
    // 使用 setTimeout 等待应用启动或者确认是否安装
    setTimeout(function () {
      // 移除 iframe
      document.body.removeChild(iframe);
      // 引导用户到 Play Store
      console.log("去下载android");
      if (!appOpened && document.hasFocus()) {
        window.location.href = playStoreUrl; // 跳转 去 下载
      }
    }, timeout);*/
  } else {
    // 对于iOS设备
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = urlScheme + "://";
    document.body.appendChild(iframe);

    setTimeout(function () {
      document.body.removeChild(iframe);
      if (!appOpened && document.hasFocus()) {
        window.location.href = appStoreUrl; // 跳转到 App Store
      }
    }, timeout);

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        appOpened = true; // 页面隐藏，可能应用已打开
      }
    });
  }
}
