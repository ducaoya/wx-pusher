/*
 * @Author: luowangming
 * @Date: 2023-03-03 17:42:15
 * @Last Modified by: luowangming
 * @Last Modified time: 2023-03-03 17:52:50
 */

import pusher from "./core/pusher.js";
import Koa from "koa";

const app = new Koa();

const data = {
  // 运行状态
  msg: "",
  // 循环次数
  loopCount: 0,
  // 发送次数
  sendCount: 0,
  // 确认次数
  confirmCount: 0,
  // 日志
  log: [],
};

function runServer() {
  setInterval(() => {
    const date = new Date();
    // 发出提醒
    if (date.getHours() === 12 && date.getMinutes() === 0) {
      pusher("记得完成青年大学习哦").then((res) => {
        data.log.push({
          type: "send",
          index: data.sendCount,
          msg: "记得完成青年大学习哦",
          result: res,
        });
        data.sendCount += 1;
      });
    }
    // 发出确认
    if (date.getHours() === 17 && date.getMinutes() === 0) {
      pusher("确认完成了青年大学习吧").then((res) => {
        data.log.push({
          type: "confirm",
          index: data.confirmCount,
          msg: "确认完成了青年大学习吧",
          result: res,
        });
        data.confirmCount += 1;
      });
    }
    count++;
  }, 60 * 1000);
  data.msg = "服务启动完成";
}

try {
  runServer();
} catch (error) {
  data.msg = error;
  runServer();
}

app.use((ctx) => {
  const param = ctx.request.query;

  if (param.test) {
    pusher("测试消息", true).then((res) => {
      data.log.push({
        type: "test",
        index: "-",
        msg: "测试消息",
        result: res,
      });
    });
  }

  ctx.body = data;
});

app.listen(7788, () => {
  console.log("项目启动", "http://127.0.0.1:7788");
});
