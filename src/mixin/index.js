/*全局混入对象,会插入到每一个组件中,需要慎用*/
import Vue from 'vue'

var mixin = {
  methods: {
    //跳转地址
    handleRouter(name) {
      this.$router.push({ name });
    },
    //微信获取code 功能ok
    getCode(goAuthUrl) {
      //推荐码登录流程
      if (location.href.indexOf("recommendCode") > 0) {
        let recode = location.href.split("?")[1].split("=")[1];
        sessionStorage.setItem("recommendCode", recode);
   


        let curUrl = window.location.href;
        if (curUrl.indexOf("code") < 0) {
          // alert("step 1 code");
          console.log("发送微信授权请求");
          sessionStorage.setItem("scanCode","true");
          window.location.href = goAuthUrl;
        }

      } else {
        //推荐码的传参

        if (sessionStorage.getItem("recommendCode") !== undefined && sessionStorage.getItem("recommendCode") !== "" && sessionStorage.getItem("recommendCode") !== null) {
          //  alert("授权登录："+sessionStorage.getItem("recommendCode"));

          let curUrl = window.location.href;
          if (curUrl.indexOf("code") < 0) {
            console.log("发送微信授权请求");
         
            window.location.href = goAuthUrl;
          }
          
          const _this = this;
          // let url = window.location.search; //获取url中"?"符后的字串
          // let url = window.location.href; //获取url中"?"符后的字串
          var ua = navigator.userAgent.toLowerCase();
          var result = /micromessenger/.test(ua) ? true : false;
          var api;
          if (result) {
            _this.code = _this.getParams("code");
    
            api = "/newLzshApi/wx/getWxEmpowerUserInfoByCode";
            // if (url.indexOf("?") != -1) {
            //   //判断是否有参数
            //   let str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            //   let strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
            //   let codeStr = strs[1].split("&");

             
            // }
          } else {
            // alert("recommendCode:" + sessionStorage.getItem("recommendCode"));
            _this.code = _this.getParams("auth_code");
            // alert("code:"+_this.code);
            api = "/newLzshApi/ali/getAliEmpowerUserInfoByCode";
            // if (url.indexOf("?") != -1) {
            //   //判断是否有参数
            //   let str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            //   let strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
            //   _this.code = strs[5];
              
            // }
          }


          // alert("code:"+_this.code);
          //获取用户信息

        
          let rcmCode = sessionStorage.getItem("recommendCode");
          // alert("rcmCode:" + rcmCode);
          let params = {
            code: _this.code,
            referenceCode: rcmCode
          }
          _this.$http
            .post(
              api,
              "data=" + JSON.stringify(params)
            )
            .then(res => {
              _this.users = res.data;
              console.log(_this.users);
              localStorage.setItem(
                "remember",
                _this.remember ? "true" : "false"
              );
              localStorage.setItem("user_name", _this.users.userName);
              localStorage.setItem("open_id", _this.users.openId);
              localStorage.setItem("id", _this.users.id);
              // alert("auth code done.token:" + res.data.redisTokenKey);
              sessionStorage.setItem("recommendCode", "");//使用完recommendCode 就删除
              sessionStorage.setItem("redisTokenKey", _this.users.redisTokenKey);
              // alert(JSON.stringify(res.data));
              _this.$store.dispatch("setUserInfoAction", _this.users);
              console.log(localStorage.getItem("user_name"));
              console.log(localStorage.getItem("open_id"));
              //扫推荐码进来不需要跳到支付页面
              // alert("scanCode:"+sessionStorage.getItem("scanCode"));
                if( sessionStorage.getItem("scanCode") !== "true" ){
                  _this.$router.push({ path: "/payment" });
                }
              
           

             
             

            });

          console.log(_this.$store);

        }
        if (sessionStorage.getItem("shopId") == "0" || sessionStorage.getItem("shopId") == null || sessionStorage.getItem("shopId") == undefined) {
          //普通授权登录流程


          const _this = this;
          let curUrl = window.location.href;
          if (
            curUrl.indexOf("code") < 0 &&
            localStorage.getItem("id") == undefined

          ) {
            //第一次跳转
            window.location.href = goAuthUrl;
          } else {
            //第二次请求接口
            if(localStorage.getItem("id") == "" || localStorage.getItem("id") == undefined){
              const _this = this;
              let url = window.location.search; //获取url中"?"符后的字串
              var ua = navigator.userAgent.toLowerCase();
              var result = /micromessenger/.test(ua) ? true : false;
              var api;


              if (result) {
                _this.code = _this.getParams("code");
    
                api = "/newLzshApi/wx/getWxEmpowerUserInfoByCode";
              
              } else {
                _this.code = _this.getParams("auth_code");
                api = "/newLzshApi/ali/getAliEmpowerUserInfoByCode";
              }
    
    
              // alert("code:"+_this.code);
              //获取用户信息
    
            
              let rcmCode = sessionStorage.getItem("recommendCode");
              // alert("rcmCode:" + rcmCode);
              let params = {
                code: _this.code,
                referenceCode: rcmCode
              }
              _this.$http
                .post(
                  api,
                  "data=" + JSON.stringify(params)
                )
                .then(res => {
                  _this.users = res.data;
                  console.log(_this.users);
                  localStorage.setItem(
                    "remember",
                    _this.remember ? "true" : "false"
                  );
                  localStorage.setItem("user_name", _this.users.userName);
                  localStorage.setItem("open_id", _this.users.openId);
                  localStorage.setItem("id", _this.users.id);
                  // alert("auth code done.token:" + res.data.redisTokenKey);
                  sessionStorage.setItem("recommendCode", "");//使用完recommendCode 就删除
                  sessionStorage.setItem("redisTokenKey", _this.users.redisTokenKey);
                  // alert(JSON.stringify(res.data));
                  _this.$store.dispatch("setUserInfoAction", _this.users);
                  console.log(localStorage.getItem("user_name"));
                  console.log(localStorage.getItem("open_id"));
             
                
               
    
                 
                 
    
                });
    
              console.log(_this.$store);

              
            }else{
              _this.uid = localStorage.getItem("id");
              console.log(localStorage.getItem("id"));
              _this.$http
                .post(
                  "/newLzshApi/userInfo/userAutoLoginByUid",
                  "data={'uid':'" + _this.uid + "'}"
                )
                .then(res => {
                  _this.users = res.data;
                  // alert("autoLogin:" + res.data);
                  // alert(JSON.stringify(res.data));
                  // alert(_this.users.redisTokenKey)
                  sessionStorage.setItem("redisTokenKey", _this.users.redisTokenKey);
                  _this.$store.dispatch("setUserInfoAction", _this.users);
                });
              // }
  
              // }
              console.log(_this.$store);
  
            }


          
          }


        }
      }

    },



    //获取参数
    getParams(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
 

    //获取系统信息

    commonSystemInfo()
    {
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res => {
        let arr = res.data.webSystemParameterConfigList;
        arr.forEach(item => {
          if (item.parameter_key == "DOMAIN") {
            this.domain = item.parameter_value;
          } else if (item.parameter_key == "WEB_IMG_PATH") {
            this.picUrlRelative = item.parameter_value;
          } else if (item.parameter_key == "WEB_WX_APPID") {
            this.appId = item.parameter_value;
          }

        });

        this.picUrl = this.domain + this.picUrlRelative;
      })
    },
    getSystemInfo() {
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res => {
        let arr = res.data.webSystemParameterConfigList;
        arr.forEach(item => {
          if (item.parameter_key == "DOMAIN") {
            this.domain = item.parameter_value;
          } else if (item.parameter_key == "WEB_IMG_PATH") {
            this.picUrlRelative = item.parameter_value;
          } else if (item.parameter_key == "WEB_WX_APPID") {
            this.appId = item.parameter_value;
          }

        });

        this.picUrl = this.domain + this.picUrlRelative;
        console.log(sessionStorage.getItem("shopId"));
        console.log(this.$store);
        console.log(this.appId);
      
        let wxAppId = this.appId;
        let uri = this.domain + "/newLzshApi/index.html";
        let redirect_uri = encodeURIComponent(uri, "utf-8");
        let goAuthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          wxAppId +
          "&redirect_uri=" +
          redirect_uri +
          "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        let aliAppId = "2018070560557462";
        let aliAuthUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
          aliAppId +
          "&scope=auth_user&redirect_uri=" +
          redirect_uri +
          "&state=init";
        var ua = navigator.userAgent.toLowerCase();
        var result = /micromessenger/.test(ua) ? true : false;
        if (result) {
          this.getCode(goAuthUrl);
        } else {
          this.getCode(aliAuthUrl);
        }
      })
    },
    userReset() {
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res => {
        let arr = res.data.webSystemParameterConfigList;
        arr.forEach(item => {
          if (item.parameter_key == "DOMAIN") {
            this.domain = item.parameter_value;
          } else if (item.parameter_key == "WEB_IMG_PATH") {
            this.picUrlRelative = item.parameter_value;
          } else if (item.parameter_key == "WEB_WX_APPID") {
            this.appId = item.parameter_value;
          }

        });
      
        this.picUrl = this.domain + this.picUrlRelative;
        console.log(sessionStorage.getItem("shopId"));
        console.log(this.$store);
        console.log(this.appId);
        let wxAppId = this.appId;
        let uri = this.domain + "/newLzshApi/index.html";
        let redirect_uri = encodeURIComponent(uri, "utf-8");
        let goAuthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          wxAppId +
          "&redirect_uri=" +
          redirect_uri +
          "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        let aliAppId = "2018070560557462";
        let aliAuthUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
          aliAppId +
          "&scope=auth_user&redirect_uri=" +
          redirect_uri +
          "&state=init";
        var ua = navigator.userAgent.toLowerCase();
        var result = /micromessenger/.test(ua) ? true : false;
        if (result) {
          this.getCode(goAuthUrl);
        } else {
          this.getCode(aliAuthUrl);
        }
      })
    }



  }
}

Vue.mixin(mixin)
