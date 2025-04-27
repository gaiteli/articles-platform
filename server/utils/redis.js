const { createClient } = require('redis');

let client

// 初始化redis客户端
const redisClient = async () => {
  if (client) return

  client = await createClient()
    .on('error', (err) => console.log('Redis connection failed', err))
    .connect();
}

/**
 * 存入数组或对象，并可选的设置过期时间
 * @param key
 * @param value
 * @param ttl 可选
 */
const setKey = async (key, value, ttl = null) => {
  if (!client) await redisClient();
  value = JSON.stringify(value);
  await client.set(key, value);

  // 如果提供了ttl, 设置过期时间
  if (ttl !== null) {
    await client.expire(key, ttl);
  }
}

/**
 * 读取数组或对象
 * @param key
 * @returns {Promise<any>} 解析后端JSON对象或数组
 */
const getKey = async (key) => {
  if (!client) await redisClient();     // 确保客户端已经初始化
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

/**
 * 清除缓存数据
 * @param key
 * @returns {Promise<any>}
 */
const delKey= async (key) => {
  if (!client) await redisClient();
  await client.del(key);
}


module.exports = { redisClient, setKey, getKey, delKey };