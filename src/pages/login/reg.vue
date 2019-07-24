<template>
  <div class="login_body">
    <van-nav-bar left-text right-text left-arrow @click-left="onClickLeft"/>
    <div class="lzsh0-logo">
      <img src="../../assets/images/lz-reg-logo.png" alt>
    </div>
    <van-cell-group>
      <van-field v-model="phone" placeholder="电话号码（+86"/>
      <van-field v-model="sms" center clearable placeholder="短信验证码">
        <van-button slot="button" size="small" @click="SendVerifyCode">发送验证码</van-button>
      </van-field>
      <van-field v-model="password" placeholder="请输入新密码"/>
      <van-field v-model="confirmPassword" placeholder="请再次输入密码"/>
      <van-button type="primary" size="large" @click="regSubmit">注册</van-button>
    </van-cell-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phone: "",

      sms: "",
      password: "",
      confirmPassword: ""
    };
  },

  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    regPhone() {
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.phone)) {
        return false;
      } else {
        return true;
      }
    },
    SendVerifyCode() {
      this.$post("/newLzshApi/userInfo/sendDynamicCode", {
        mobile: this.phone
      }).then(res => {
        this.msgId = res.data.msgId;
        this.$toast("验证码已发送");
      });
    },
    regSubmit() {
      let params = {
        mobile: this.phone,
        validCode: this.sms,
        msgId: this.msgId,
        loginPwd: this.password
      };
      if (this.phone == "") {
        this.$toast("手机号不能为空");
        return false;
      } else if (!this.regPhone()) {
        this.$toast("请输入正确的手机号");
        return false;
      }
      if (this.password == "") {
        this.$toast("密码不能为空");
        return false;
      }
      if (this.confirmPassword == "") {
        this.$toast("请确认密码");
        return false;
      }
      if (this.confirmPassword !== this.password) {
        this.$toast("两次密码输入不一致");
        return false;
      } else {
        this.$post("/newLzshApi/userInfo/userMobileLogin", params).then(res => {
          this.$toast("注册成功");
        });
      }
    }
  }
};
</script>
<style scoped>
.van-nav-bar .van-icon {
  color: #898989;
}
.lzsh0-logo {
  position: relative;
  margin-bottom: 1.2rem;
}
.lzsh0-logo img {
  width: 1.53rem;
  height: 1.27rem;
}
.van-cell-group {
  padding: 0 1.03rem;
}
.van-cell {
  padding: 0;
}
.van-field__body {
  height: auto;
  line-height: 0.4rem;
  border-bottom: 0.01rem solid #ccc;
  padding: 0.2rem 0;
}
.van-field__control {
  font-size: 0.31rem;
}
.van-button--default {
  color: #ffa92e;
  font-size: 0.28rem;
  background: #fff;
  border: 0.01rem solid #fff;
}
.van-cell-group .van-cell:nth-child(2) .van-field__control {
  border-right: 0.01rem solid #ccc;
}
.van-button--primary {
  border: none;

  background: #ff3333;
  color: #fff;
  height: 0.84rem;
  line-height: 0.84rem;
  border-radius: 0.34rem;
}
</style>

