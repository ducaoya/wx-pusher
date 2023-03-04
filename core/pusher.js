/*
 * @Author: ducaoya
 * @Date: 2023-03-03 16:58:26
 * @Last Modified by: luowangming
 * @Last Modified time: 2023-03-03 17:40:53
 */
import axios from "axios";

const appToken = "AT_70YJvySWGC0O6YUDj9bolv6u2mnL1IBf";

/**
 * 推送消息
 * @param {string} content 内容
 * @param {string} summary 摘要
 * @param {number} contentType
 */
export default async function pusher(
  content,
  isTest = false,
  summary = content,
  contentType = 1
) {
  const url = "https://wxpusher.zjiecode.com/api/send/message";

  let uids = [];

  if (isTest) {
    uids = ["UID_Jz6PaE1GzntYtnoPpcRjTg2PDg1B"];
  } else {
    uids = await getUserIDs();
  }

  const res = await axios.post(url, {
    appToken,
    content,
    summary, //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
    contentType, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
    // topicIds:[ //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
    //     123
    // ],
    uids, //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
    url: "https://wxpusher.zjiecode.com", //原文链接，可选参数
    verifyPay: false, //是否验证订阅时间，true表示只推送给付费订阅用户，false表示推送的时候，不验证付费，不验证用户订阅到期时间，用户订阅过期了，也能收到。
  });

  console.log(res.data);
  return res.data;
}

/**
 * 获取用户id请求
 * @param {number} page
 * @param {number} pageSize
 * @param {number} type
 */
async function getUserID(page, pageSize = 100, type = 0) {
  const res = await axios.get(
    "https://wxpusher.zjiecode.com/api/fun/wxuser/v2",
    {
      params: {
        appToken,
        page,
        pageSize,
      },
    }
  );

  const { status, data } = res;
  if (status === 200 && data.code === 1000) {
    const ids = data.data.records.map((user) => {
      return user.uid;
    });

    return {
      ...data.data,
      ids,
    };
  }
}

async function getUserIDs() {
  let total = 0;
  let page = 1;
  let pageSize = 100;
  let ids = [];

  const res = await getUserID(page, pageSize);
  total = res.total;
  page = res.page;
  ids = res.ids;

  while (total > page * pageSize) {
    const res = await getUserID(page, pageSize);
    total = res.total;
    page = res.page;
    ids = [...ids, ...res.ids];
  }

  return ids;
}
