/*
 * @Author: luowangming
 * @Date: 2023-03-03 17:42:15
 * @Last Modified by: luowangming
 * @Last Modified time: 2023-03-03 17:52:50
 */

import pusher from "./core/pusher.js";
import Koa from "koa";

const app = new Koa();

let msg = "";

try {
  setInterval(() => {
    const date = new Date();
    // 发出提醒
    if (date.getHours() === 12 && date.getMinutes() === 0) {
      pusher("记得完成青年大学习哦");
    }
    // 发出确认
    if (date.getHours() === 17 && date.getMinutes() === 0) {
      pusher("确认完成了青年大学习吧");
    }
  }, 60 * 1000);
  msg = "服务启动完成";
} catch (error) {
  msg = error;
}

app.use((ctx) => {
  ctx.body = {
    msg,
  };
});

app.listen(7788, () => {
  console.log("项目启动");
});
