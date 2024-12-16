// 已废弃
import { getToken } from "./token";

async function getUserInfo(url='http://localhost:9000/user') {
  try {
    const token = getToken()
    console.log(token);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const userInfo = await response.json()
    console.log("Success user info fetch:", userInfo);
    return userInfo
  } catch (error){
    console.error("Error:", error)
    throw error
  }
}

export default getUserInfo