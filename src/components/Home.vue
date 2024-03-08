<script setup lang="jsx">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { MessageStore } from '@/store/modules/message.js';
import { useRoute, useRouter } from 'vue-router';

const message = useMessage();
const messageStore = MessageStore();
const router = useRouter();
const ws = new WebSocket(`ws://${location.host}/api`);
let messageValue = ref(null);
let timer = ref(null);
const scrollbar = ref(null);
onMounted(() => {
    if (window.WebSocket) {
        init();
    } else {
        message.warning('你的浏览器不支持WebSocket');
    }
});
const init = () => {
    window.addEventListener('keydown', enterdown);
    ws.addEventListener('open', e => {
        ws.send(
            JSON.stringify({
                userInfor: messageStore.userInfor,
                type: 'open',
            })
        );
    });
    ws.addEventListener('close', e => {
        console.log('FE:WebSocket close', e);
    });
    ws.addEventListener('error', e => {
        message.warning('连接已经关闭，或者打开连接失败');
    });
    ws.addEventListener('message', e => {
        const file = new FileReader();
        file.readAsText(e.data, 'utf-8');
        file.onload = function (params) {
            const msg = JSON.parse(file.result);
            console.log(msg);
            messageStore.setFlagState(msg);
            if (msg.type == 'open') {
                messageStore.setNumberState(msg);
                if (!messageStore.getFlagState) {
                    message.success(`欢迎${msg.userInfor.uesrName}加入聊天室`);
                }
                if (!messageStore.numberState) {
                    messageStore.setPersonList(msg);
                }
            } else if (msg.type == 'message') {
                messageStore.setMessageList(msg);
            } else if (msg.type == 'close') {
                if (!messageStore.getFlagState) {
                    message.warning(`${msg.userInfor.uesrName}已退出房间`);
                }
                messageStore.removePersonList(msg);
                messageStore.$patch({
                    userInfor: {
                        uuid: null,
                    },
                });
                router.replace({ name: 'login' });
                ws.close();
            }
        };
    });
};
const handleSendBtnClick = () => {
    if (!messageValue.value || !messageValue.value.trim()) {
        message.warning('请输入要发送的内容');
        return;
    }
    //接收发送的内容
    ws.send(
        //将返回的数据以对象的形式 展示在前台
        JSON.stringify({
            userInfor: messageStore.userInfor,
            msg: messageValue.value,
            type: 'message',
        })
    );
    //输入完信息后 置空
    messageValue.value = '';
    clearTimeout(timer);
    timer = setTimeout(() => {
        scrollbar.value.scrollBy(0, 240 * messageStore.getMessageList.length);
    }, 100);
};
const enterdown = e => {
    if (e.keyCode == 13) {
        handleSendBtnClick();
    }
};
const handlerClose = () => {
    ws.send(
        JSON.stringify({
            userInfor: messageStore.userInfor,
            type: 'close',
        })
    );
};
window.addEventListener('beforeunload', e => {
    handlerClose();
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', enterdown);
    clearTimeout(timer);
});
</script>

<template>
    <div class="page">
        <div class="main">
            <n-scrollbar style="height: calc(100% - 40px)" ref="scrollbar">
                <div class="card">
                    <template v-for="item in messageStore.getMessageList" :key="item.id">
                        <template v-if="item.userInfor.uuid == messageStore.userInfor.uuid">
                            <div class="cards1">
                                <div class="top">
                                    <span>{{ item.userInfor.uesrName }}</span>
                                </div>
                                <div class="bottom">
                                    <div class="chatting">{{ item.msg }}</div>
                                    <n-avatar
                                        :size="45"
                                        :src="item.userInfor.imgUrl"
                                        style="margin-left: 10px"
                                    />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="cards2">
                                <div class="top">
                                    <span>{{ item.userInfor.uesrName }}</span>
                                </div>
                                <div class="bottom">
                                    <n-avatar
                                        :size="45"
                                        :src="item.userInfor.imgUrl"
                                        style="margin-right: 10px"
                                    />
                                    <div class="chatting">{{ item.msg }}</div>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </n-scrollbar>
            <n-flex :wrap="false" style="padding: 0 15px">
                <n-input size="large" v-model:value="messageValue" type="text" placeholder="" />
                <n-button size="large" @click="handleSendBtnClick">发送</n-button>
            </n-flex>
        </div>
        <n-button size="large" @click="handlerClose">关闭</n-button>
    </div>
</template>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .main {
        width: 375px;
        height: 667px;
        border: 1px solid black;
        border-bottom: 0px;
        box-sizing: border-box;
        position: relative;
        .card {
            display: flex;
            flex-direction: column;
            .cards1 {
                box-sizing: border-box;
                width: 100%;
                padding: 10px 20px 10px 0px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .top {
                    color: #b2b2b2;
                }
                .bottom {
                    display: flex;
                    justify-content: right;
                    .chatting {
                        box-sizing: border-box;
                        max-width: 200px;
                        min-width: 50px;
                        min-height: 35px;
                        line-height: 35px;
                        font-size: 18px;
                        padding: 5px;
                        background-color: #95ec69;
                        border-radius: 5px;
                        word-wrap: break-word;
                    }
                }
            }
            .cards2 {
                box-sizing: border-box;
                width: 100%;
                padding: 10px;
                flex-direction: column;
                align-items: flex-start;
                .top {
                    color: #b2b2b2;
                }
                .bottom {
                    display: flex;
                    justify-content: left;
                    .chatting {
                        box-sizing: border-box;
                        max-width: 200px;
                        min-width: 50px;
                        min-height: 35px;
                        line-height: 35px;
                        font-size: 18px;
                        padding: 5px;
                        padding: '5px';
                        background-color: #95ec69;
                        border-radius: 5px;
                        word-wrap: break-word;
                    }
                }
            }
        }
    }
}
</style>
