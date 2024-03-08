import { defineStore } from "pinia";
import { piniaPersistConfig } from "@/store/initPiniaPersist.js";

export const MessageStore = defineStore({
    id: "MessageState",
    state: () => {
        return {
            messageList: [],
            personList: [],
            flagState: null,
            numberState: null,
            userInfor: {
                uesrName: null,
                passWord: null,
                imgUrl: null,
                uuid: null,
            }
        }
    },
    getters: {
        // 获取登录信息
        getUUID: state => state.uuid,
        // 获取消息列表
        getMessageList: state => state.messageList,
        // 获取成员列表
        getPersonList: state => state.personList,
        getFlagState: state => state.flagState,
        getNumberState: state => state.numberState,
    },
    actions: {
        setUUID() {
            let uuid = '';
            for (let i = 0; i < 32; i++) {
                let random = (Math.random() * 16) | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-';
                uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
            }
            this.userInfor.uuid = uuid
        },
        setFlagState(value) {
            if (value.userInfor.uuid == this.userInfor.uuid) {
                this.flagState = true
            } else {
                this.flagState = false
            }
        },
        setNumberState(value) {
            this.numberState = this.personList.some(item => item.userInfor.uuid == value.userInfor.uuid)
        },
        setPersonList(value) {
            this.personList.push(value)
        },
        setMessageList(value) {
            this.messageList.push(value)
        },
        removePersonList(value) {
            this.personList = this.personList.filter(item => item.userInfor.uuid != value.userInfor.uuid)
        }
    },
    // 持久化缓存
    persist: piniaPersistConfig("MessageState")
})