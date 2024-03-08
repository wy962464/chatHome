<script setup>
import { reactive, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import { MessageStore } from '@/store/modules/message.js';

const formRef = ref(null);
const message = useMessage();
const router = useRouter();
const messageStore = MessageStore();
let formValue = reactive({
    userName: '',
    password: '',
    fileList: [],
});
const rules = reactive({
    userName: {
        required: true,
        message: '请输入用户名',
        trigger: ['input', 'blur'],
    },
    password: [
        {
            required: true,
            validator(rule, value) {
                if (!value) {
                    return new Error('请输入密码');
                }
                return true;
            },
            trigger: ['input', 'blur'],
        },
    ],
    image: [
        {
            required: true,
            validator(rule, value) {
                if (formValue.fileList.length <= 0) {
                    return new Error('请上传头像');
                }
                return true;
            },
            trigger: ['input', 'blur'],
        },
    ],
});
let handleValidateClick = () => {
    formRef.value?.validate(errors => {
        if (!errors) {
            message.success('登录成功');
            router.replace({ name: 'Home' });
            messageStore.setUUID();
            messageStore.$patch({
                userInfor: {
                    uesrName: formValue.userName,
                    passWord: formValue.password,
                },
            });
        } else {
            message.error('登录失败');
        }
    });
};
const uploadImg = file => {
    return new Promise((resolve, reject) => {
        const raeder = new FileReader();
        raeder.readAsDataURL(file);
        raeder.onload = () => resolve(raeder.result);
        raeder.onerror = error => reject(error);
    });
};
const customRequest = async data => {
    let base64Img = await uploadImg(data.file.file);
    data.onFinish();
    messageStore.$patch({
        userInfor: {
            imgUrl: base64Img,
        },
    });
};
</script>

<template>
    <div class="page">
        <div class="loginBg">
            <div class="loginMain">
                <h1>登录</h1>
                <n-form
                    ref="formRef"
                    label-placement="left"
                    :label-width="80"
                    :model="formValue"
                    size="large"
                    :rules="rules"
                >
                    <n-form-item label="" path="userName">
                        <n-input v-model:value="formValue.userName" placeholder="请输入用户名" />
                    </n-form-item>
                    <n-form-item label="" path="password">
                        <n-input
                            type="password"
                            show-password-on="mousedown"
                            v-model:value="formValue.password"
                            placeholder="请输入密码"
                        />
                    </n-form-item>
                    <n-form-item label="" path="image">
                        <n-upload
                            action="#"
                            :custom-request="customRequest"
                            v-model:file-list="formValue.fileList"
                            :max="1"
                            list-type="image-card"
                            style="font-size: 16px"
                        >
                            上传头像
                        </n-upload>
                    </n-form-item>
                    <n-form-item label="" path="checkboxValue">
                        <n-grid x-gap="12" :cols="2">
                            <n-gi>
                                <n-checkbox v-model:checked="formValue.remPassword">
                                    记住密码
                                </n-checkbox>
                            </n-gi>
                            <n-gi style="text-align: right">
                                <n-button text text-color="#0a61bd">忘记密码?</n-button>
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <n-form-item label="">
                        <n-button block type="info" @click="handleValidateClick">登录</n-button>
                    </n-form-item>
                </n-form>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.page {
    width: 100%;
    height: 100%;
    background-color: #eee;
    background-image: url('@/assets/svg/login_bg.svg');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    .loginBg {
        width: calc(100% - 80px);
        height: calc(100% - 80px);
        position: relative;
        box-sizing: border-box;
        background-color: #fffc;
        border-radius: 10px;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .loginMain {
            width: 400px;
            position: absolute;
            padding: 50px 50px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 20px 30px 70px #0003;
            h1 {
                margin-bottom: 30px;
            }
        }
    }
}
</style>
